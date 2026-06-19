// Lightweight RAG chatbot service for HealingWave.
// Builds a knowledge base from DB + static info, retrieves relevant
// snippets by keyword overlap, and calls the Hugging Face router LLM.
const Doctor = require('../models/Doctor');
const Medicine = require('../models/Medicine');
const BloodAvailability = require('../models/BloodAvailability');

const HF_URL = 'https://router.huggingface.co/v1/chat/completions';
const STOPWORDS = new Set(['the','a','an','is','are','to','of','for','and','or','in','on','at','my','i','do','does','can','how','what','where','when','who','please','need','want','me','you','your','it','this','that','with','about','tell','give']);

const STATIC_DOCS = [
  { title: 'About HealingWave', text: 'HealingWave is a full-service hospital portal offering appointments, blood bank, pharmacy, lab tests, ward/cabin booking, prescriptions and billing. See the About page at /about.' },
  { title: 'Book an appointment', text: 'To book an appointment, open the Doctors page at /doctors, choose a doctor and click Book Appointment. You must sign in as a patient (Sign In button, Patient tab) to confirm a booking.' },
  { title: 'Doctors', text: 'Browse and filter doctors by department on the /doctors page. Each doctor shows specialty, qualifications and availability.' },
  { title: 'Blood bank', text: 'The Blood Bank at /blood-bank shows live blood availability by group, lets you donate blood, and lets patients book or buy blood units. Visit /blood-availability for details.' },
  { title: 'Pharmacy', text: 'The Pharmacy at /pharmacy lists all medicines. You can search, filter by category, sort by price, view medicine details, and buy medicine through the cart at /buy-medicine.' },
  { title: 'Health Card', text: 'The Health Card lets patients pay for medicines, tests and bills while earning points. Sign in as a patient at the Sign In button to manage it.' },
  { title: 'Support and contact', text: 'For help, visit the Support page at /support. Emergency hotline: +880 1234-567890. Email: info@healingwave.com.' },
  { title: 'Patient account', text: 'Patients can register or sign in using the Sign In button (Patient tab). With an account you can book appointments, view prescriptions, pay bills and access your health card.' },
  { title: 'Doctor account', text: 'Doctors can register or sign in using the Sign In button (Doctor tab) to manage prescriptions, appointments and patient details.' },
  { title: 'Blood group compatibility', text: 'O- is the universal donor; AB+ is the universal recipient. O+ donates to O+/A+/B+/AB+. A- to A and AB. B- to B and AB. Always confirm compatibility with medical staff before transfusion.' },
];

function tokenize(s) {
  return (s || '').toLowerCase().split(/[^a-z0-9+]+/).filter((t) => t && !STOPWORDS.has(t));
}

// Build documents from live DB data + static info.
async function buildKnowledgeBase() {
  const docs = [...STATIC_DOCS];

  try {
    const doctors = await Doctor.find().select('firstName lastName specialty department degrees availability').lean();
    for (const d of doctors) {
      const name = `Dr. ${d.firstName} ${d.lastName}`;
      docs.push({
        title: `Doctor: ${name}`,
        text: `${name} is a ${d.specialty || 'specialist'} in the ${d.department || 'general'} department. Qualifications: ${d.degrees || 'N/A'}. Availability: ${d.availability || 'See /doctors'}. Book at /doctors.`,
      });
    }
  } catch (e) { /* ignore */ }

  try {
    const blood = await BloodAvailability.find().lean();
    if (blood.length) {
      const summary = blood.map((b) => `${b.bloodGroup}: ${b.count} units`).join(', ');
      docs.push({ title: 'Blood availability (live stock)', text: `Current blood stock at the blood bank — ${summary}. Book or buy blood at /blood-bank.` });
      for (const b of blood) {
        docs.push({ title: `Blood stock ${b.bloodGroup}`, text: `Blood group ${b.bloodGroup} currently has ${b.count} units available in the blood bank.` });
      }
    }
  } catch (e) { /* ignore */ }

  try {
    const meds = await Medicine.find().select('name genericName price dosageForm strength manufacturer').lean();
    for (const m of meds) {
      docs.push({
        title: `Medicine: ${m.name}`,
        text: `${m.name} (${m.genericName}) ${m.strength} ${m.dosageForm} by ${m.manufacturer} costs ৳${m.price}. Available in the Pharmacy at /pharmacy.`,
      });
    }
  } catch (e) { /* ignore */ }

  return docs;
}

// Score docs by keyword overlap; return top-k context string.
function retrieve(query, docs, k = 6) {
  const qTokens = tokenize(query);
  if (!qTokens.length) return [];
  const scored = docs.map((doc) => {
    const titleTokens = tokenize(doc.title);
    const bodyTokens = tokenize(doc.text);
    let score = 0;
    for (const t of qTokens) {
      if (titleTokens.includes(t)) score += 3;
      score += bodyTokens.filter((b) => b === t).length;
    }
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
    '',
    'CONTEXT:',
    context || '(no specific context found)',
  ].join('\n');

  const messages = [{ role: 'system', content: system }];
  for (const h of history.slice(-4)) {
    if (h && h.role && h.content) messages.push({ role: h.role, content: String(h.content).slice(0, 500) });
  }
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
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`HF ${resp.status}: ${errText.slice(0, 200)}`);
    }
    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty LLM response');
    return content.trim();
  } finally {
    clearTimeout(timeout);
  }
}

async function generateAnswer(message, history = []) {
  const docs = await buildKnowledgeBase();
  const top = retrieve(message, docs, 6);
  const answer = await askLLM(message, top, history);
  return { answer, usedContext: top.map((d) => d.title) };
}

module.exports = { generateAnswer, buildKnowledgeBase, retrieve };
