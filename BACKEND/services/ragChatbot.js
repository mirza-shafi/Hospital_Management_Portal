// Modern RAG chatbot service for HealingWave.
// Parent-child retrieval: small CHILD chunks are embedded & matched; the larger
// PARENT document is returned as context. Embeddings are persisted in MongoDB
// (KnowledgeChunk). Retrieval prefers Atlas $vectorSearch, falls back to in-app
// cosine similarity, and finally to lexical keyword matching if embeddings are
// unavailable.
const crypto = require('crypto');
const Doctor = require('../models/Doctor');
const Medicine = require('../models/Medicine');
const BloodAvailability = require('../models/BloodAvailability');
const KnowledgeChunk = require('../models/KnowledgeChunk');
const { embedOne, embedMany, cosine } = require('./embeddings');

const HF_URL = 'https://router.huggingface.co/v1/chat/completions';
const VECTOR_INDEX = process.env.ATLAS_VECTOR_INDEX || 'vector_index';
const STOPWORDS = new Set(['the','a','an','is','are','to','of','for','and','or','in','on','at','my','i','do','does','can','how','what','where','when','who','please','need','want','me','you','your','it','this','that','with','about','tell','give']);

const STATIC_DOCS = [
  { id: 'static-about', type: 'static', title: 'About HealingWave', text: 'HealingWave is a full-service hospital portal offering appointments, blood bank, pharmacy, lab tests, ward and cabin booking, prescriptions and billing. Learn more on the About page at /about.' },
  { id: 'static-appointment', type: 'static', title: 'Book an appointment', text: 'To book an appointment, open the Doctors page at /doctors, choose a doctor and click Book Appointment. You must sign in as a patient (Sign In button, Patient tab) to confirm a booking.' },
  { id: 'static-doctors', type: 'static', title: 'Find a doctor', text: 'Browse and filter doctors by department on the /doctors page. Each doctor shows specialty, qualifications and availability.' },
  { id: 'static-bloodbank', type: 'static', title: 'Blood bank', text: 'The Blood Bank at /blood-bank shows live blood availability by group, lets you donate blood, and lets patients book or buy blood units. Detailed availability is at /blood-availability.' },
  { id: 'static-pharmacy', type: 'static', title: 'Pharmacy', text: 'The Pharmacy at /pharmacy lists all medicines. You can search, filter by category, sort by price, view medicine details, and buy medicine through the cart at /buy-medicine.' },
  { id: 'static-healthcard', type: 'static', title: 'Health Card', text: 'The Health Card lets patients pay for medicines, tests and bills while earning points. Sign in as a patient to manage it.' },
  { id: 'static-support', type: 'static', title: 'Support and contact', text: 'For help, visit the Support page at /support. Emergency hotline: +880 1234-567890. Email: info@healingwave.com.' },
  { id: 'static-patient', type: 'static', title: 'Patient account', text: 'Patients can register or sign in using the Sign In button (Patient tab). With an account you can book appointments, view prescriptions, pay bills and access your health card.' },
  { id: 'static-doctor-acct', type: 'static', title: 'Doctor account', text: 'Doctors can register or sign in using the Sign In button (Doctor tab) to manage prescriptions, appointments and patient details.' },
  { id: 'static-compat', type: 'static', title: 'Blood group compatibility', text: 'O negative is the universal donor. AB positive is the universal recipient. O positive donates to all positive groups. Always confirm compatibility with medical staff before transfusion.' },
];

function tokenize(s) {
  return (s || '').toLowerCase().split(/[^a-z0-9+]+/).filter((t) => t && !STOPWORDS.has(t));
}

// ---- Parent documents (built live from DB + static) ----
async function buildKnowledgeBase() {
  const docs = [...STATIC_DOCS];
  try {
    const doctors = await Doctor.find().select('firstName lastName specialty department degrees availability').lean();
    for (const d of doctors) {
      const name = `Dr. ${d.firstName} ${d.lastName}`;
      docs.push({ id: `doctor-${d._id}`, type: 'doctor', title: `Doctor: ${name}`,
        text: `${name} is a ${d.specialty || 'specialist'} in the ${d.department || 'general'} department. Qualifications: ${d.degrees || 'N/A'}. Availability: ${d.availability || 'see /doctors'}. Book an appointment at /doctors.` });
    }
  } catch (e) {}
  try {
    const blood = await BloodAvailability.find().lean();
    if (blood.length) {
      docs.push({ id: 'blood-summary', type: 'blood', title: 'Blood availability (live stock)',
        text: `Current blood stock at the blood bank: ${blood.map((b) => `${b.bloodGroup} ${b.count} units`).join(', ')}. Book or buy blood at /blood-bank.` });
      for (const b of blood) {
        docs.push({ id: `blood-${b.bloodGroup}`, type: 'blood', title: `Blood stock ${b.bloodGroup}`,
          text: `Blood group ${b.bloodGroup} currently has ${b.count} units available in the blood bank.` });
      }
    }
  } catch (e) {}
  try {
    const meds = await Medicine.find().select('name genericName price dosageForm strength manufacturer').lean();
    for (const m of meds) {
      docs.push({ id: `medicine-${m._id}`, type: 'medicine', title: `Medicine: ${m.name}`,
        text: `${m.name} (${m.genericName}) ${m.strength} ${m.dosageForm} by ${m.manufacturer} costs BDT ${m.price}. Available in the Pharmacy at /pharmacy.` });
    }
  } catch (e) {}
  return docs;
}

// ---- Parent -> child chunks ----
function chunkParent(parent) {
  const sentences = (parent.text.match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) || [parent.text])
    .map((s) => s.trim()).filter(Boolean);
  // Title-prefixed children improve recall on short docs.
  const children = sentences.map((s) => `${parent.title}. ${s}`);
  return children.length ? children : [parent.title];
}

function hashParents(parents) {
  const h = crypto.createHash('sha1');
  for (const p of parents) h.update(p.id + '|' + p.text + '\n');
  return h.digest('hex').slice(0, 16);
}

// ---- Build / refresh the persistent embedding index ----
async function ensureIndex() {
  const parents = await buildKnowledgeBase();
  const buildHash = hashParents(parents);
  const existing = await KnowledgeChunk.countDocuments({ buildHash });
  if (existing > 0) return { built: false, buildHash, parents };

  // Rebuild: chunk -> embed -> persist
  const childTexts = [];
  const meta = [];
  for (const p of parents) {
    for (const c of chunkParent(p)) {
      childTexts.push(c);
      meta.push({ parentId: p.id, type: p.type, title: p.title, parentText: p.text });
    }
  }
  const vectors = await embedMany(childTexts);
  const chunkDocs = meta.map((m, i) => ({ ...m, childText: childTexts[i], embedding: vectors[i], buildHash }));

  await KnowledgeChunk.deleteMany({});
  await KnowledgeChunk.insertMany(chunkDocs);
  return { built: true, buildHash, parents, count: chunkDocs.length };
}

// ---- Vector retrieval (Atlas $vectorSearch -> cosine fallback) ----
async function vectorRetrieve(query, k = 4) {
  const qv = await embedOne(query);

  // 1) Try Atlas Vector Search (requires a search index named VECTOR_INDEX)
  try {
    const hits = await KnowledgeChunk.aggregate([
      { $vectorSearch: { index: VECTOR_INDEX, path: 'embedding', queryVector: qv, numCandidates: 100, limit: 16 } },
      { $project: { _id: 0, parentId: 1, title: 1, parentText: 1, score: { $meta: 'vectorSearchScore' } } },
    ]);
    if (hits && hits.length) return groupParents(hits, k);
  } catch (e) {
    // index not present / not supported -> fall back to cosine
  }

  // 2) In-app cosine over stored embeddings
  const chunks = await KnowledgeChunk.find().select('parentId title parentText embedding').lean();
  const scored = chunks.map((c) => ({ parentId: c.parentId, title: c.title, parentText: c.parentText, score: cosine(qv, c.embedding) }));
  scored.sort((a, b) => b.score - a.score);
  return groupParents(scored.slice(0, 16), k);
}

// Collapse child hits to unique parents (best score wins), return top-k parents.
function groupParents(hits, k) {
  const byParent = new Map();
  for (const h of hits) {
    const cur = byParent.get(h.parentId);
    if (!cur || h.score > cur.score) byParent.set(h.parentId, h);
  }
  return [...byParent.values()].sort((a, b) => b.score - a.score).slice(0, k)
    .map((h) => ({ title: h.title, text: h.parentText }));
}

// ---- Lexical fallback (no embeddings) ----
function keywordRetrieve(query, docs, k = 5) {
  const qTokens = tokenize(query);
  if (!qTokens.length) return [];
  const scored = docs.map((doc) => {
    const t = tokenize(doc.title), b = tokenize(doc.text);
    let score = 0;
    for (const q of qTokens) { if (t.includes(q)) score += 3; score += b.filter((x) => x === q).length; }
    return { doc, score };
  });
  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, k).map((s) => s.doc);
}

async function askLLM(message, contextDocs, history = []) {
  const token = process.env.HF_API_TOKEN;
  const model = process.env.HF_MODEL || 'meta-llama/Llama-3.1-8B-Instruct';
  if (!token) throw new Error('HF_API_TOKEN not configured');
  const context = contextDocs.map((d) => `- ${d.title}: ${d.text}`).join('\n').slice(0, 3000);

  const system = [
    'You are HealingWave Assistant, a friendly virtual assistant for the HealingWave hospital web portal.',
    'Answer the user using the CONTEXT below when relevant. Be concise (2-5 sentences).',
    'When directing users to a page, ALWAYS use markdown links in the exact form [Label](/path), e.g. [Doctors](/doctors), [Blood Bank](/blood-bank), [Pharmacy](/pharmacy), [About](/about), [Support](/support). Never write a bare path in brackets like [/doctors].',
    'Do NOT invent specific facts (doctor names, prices, stock counts) that are not in the CONTEXT. If asked for data you do not have, say you are not sure and point to the relevant page or Support.',
    'You are not a doctor: never give a diagnosis or prescribe; for medical concerns, advise consulting a qualified doctor or booking an appointment.',
    '', 'CONTEXT:', context || '(no specific context found)',
  ].join('\n');

  const messages = [{ role: 'system', content: system }];
  for (const h of history.slice(-4)) if (h && h.role && h.content) messages.push({ role: h.role, content: String(h.content).slice(0, 500) });
  messages.push({ role: 'user', content: String(message).slice(0, 800) });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const resp = await fetch(HF_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, max_tokens: 350, temperature: 0.4 }),
      signal: controller.signal,
    });
    if (!resp.ok) throw new Error(`HF ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty LLM response');
    return content.trim();
  } finally { clearTimeout(timeout); }
}

// Live aggregate totals so count/"how many" questions are accurate.
async function statsContext() {
  try {
    const [doctorCount, medicineCount, depts, blood] = await Promise.all([
      Doctor.countDocuments(),
      Medicine.countDocuments(),
      Doctor.distinct('department'),
      BloodAvailability.find().lean(),
    ]);
    const cleanDepts = depts.filter(Boolean);
    const bloodTotal = blood.reduce((s, b) => s + (b.count || 0), 0);
    return {
      title: 'Hospital statistics (live totals)',
      text: `The hospital currently has ${doctorCount} doctors across ${cleanDepts.length} departments (${cleanDepts.join(', ') || 'various'}). The pharmacy stocks ${medicineCount} different medicines. The blood bank has ${bloodTotal} total units across ${blood.length} blood groups.`,
    };
  } catch (e) {
    return null;
  }
}

async function generateAnswer(message, history = []) {
  let top = [];
  let retrieval = 'vector';
  try {
    await ensureIndex();
    top = await vectorRetrieve(message, 4);
  } catch (e) {
    console.error('Vector retrieval failed, using keyword fallback:', e.message);
    retrieval = 'keyword';
    const docs = await buildKnowledgeBase();
    top = keywordRetrieve(message, docs, 5);
  }
  // Always prepend accurate live totals (for "how many / total" questions)
  const stats = await statsContext();
  if (stats) top = [stats, ...top];

  const answer = await askLLM(message, top, history);
  return { answer, retrieval, usedContext: top.map((d) => d.title) };
}

// ---- Debounced background rebuild (called after admin writes) ----
let rebuildTimer = null;
let rebuilding = false;
function scheduleRebuild(delay = 2500) {
  if (rebuildTimer) clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(async () => {
    rebuildTimer = null;
    if (rebuilding) return;
    rebuilding = true;
    try {
      const res = await ensureIndex(); // only rebuilds if the content hash changed
      if (res && res.built) console.log(`[RAG] Knowledge index rebuilt in background: ${res.count} chunks.`);
    } catch (e) {
      console.error('[RAG] Background rebuild failed:', e.message);
    } finally {
      rebuilding = false;
    }
  }, delay);
}

module.exports = { generateAnswer, ensureIndex, scheduleRebuild, buildKnowledgeBase, vectorRetrieve, keywordRetrieve };
