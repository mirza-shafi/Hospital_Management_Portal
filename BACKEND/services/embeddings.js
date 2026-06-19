// Embedding utilities for the RAG pipeline.
// Uses Hugging Face hosted feature-extraction (sentence-transformers/all-MiniLM-L6-v2, 384-dim).
const EMBED_MODEL = process.env.HF_EMBED_MODEL || 'sentence-transformers/all-MiniLM-L6-v2';
const EMBED_DIM = 384;
const EMBED_URL = `https://router.huggingface.co/hf-inference/models/${EMBED_MODEL}/pipeline/feature-extraction`;

// Mean-pool helper if the API returns token-level vectors (matrix) instead of a sentence vector.
function meanPool(vec) {
  if (!Array.isArray(vec)) return null;
  if (typeof vec[0] === 'number') return vec; // already a sentence vector
  // vec is array of token vectors -> average
  const rows = vec.length;
  const cols = vec[0].length;
  const out = new Array(cols).fill(0);
  for (const row of vec) for (let i = 0; i < cols; i++) out[i] += row[i];
  for (let i = 0; i < cols; i++) out[i] /= rows;
  return out;
}

async function callHF(inputs) {
  const token = process.env.HF_API_TOKEN;
  if (!token) throw new Error('HF_API_TOKEN not configured');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 40000);
  try {
    const resp = await fetch(EMBED_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs, options: { wait_for_model: true } }),
      signal: controller.signal,
    });
    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`HF embed ${resp.status}: ${t.slice(0, 160)}`);
    }
    return await resp.json();
  } finally {
    clearTimeout(timeout);
  }
}

// Embed a single string -> 384-dim vector.
async function embedOne(text) {
  const data = await callHF(text);
  const v = meanPool(data);
  if (!v || v.length !== EMBED_DIM) throw new Error(`Unexpected embedding shape (${v && v.length})`);
  return v;
}

// Embed an array of strings (batched) -> array of vectors.
async function embedMany(texts, batchSize = 32) {
  const out = [];
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const data = await callHF(batch);
    // data is array; each item is a sentence vector or a token matrix
    for (const item of data) {
      const v = meanPool(item);
      if (!v || v.length !== EMBED_DIM) throw new Error('Unexpected batch embedding shape');
      out.push(v);
    }
  }
  return out;
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

module.exports = { embedOne, embedMany, cosine, EMBED_DIM, EMBED_MODEL };
