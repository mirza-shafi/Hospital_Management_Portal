// Build (or refresh) the persistent embedding index for the RAG chatbot.
// Usage: node scripts/buildEmbeddings.js
require('dotenv').config();
const mongoose = require('mongoose');
const { ensureIndex } = require('../services/ragChatbot');
const { EMBED_MODEL } = require('../services/embeddings');

(async () => {
  try {
    if (!process.env.ATLAS_URI) throw new Error('ATLAS_URI not set');
    if (!process.env.HF_API_TOKEN) throw new Error('HF_API_TOKEN not set');
    await mongoose.connect(process.env.ATLAS_URI);
    console.log('Connected to MongoDB. Embedding model:', EMBED_MODEL);

    const t0 = Date.now();
    const res = await ensureIndex();
    const secs = ((Date.now() - t0) / 1000).toFixed(1);

    if (res.built) {
      console.log(`Built embedding index: ${res.count} child chunks from ${res.parents.length} parent docs in ${secs}s (buildHash ${res.buildHash}).`);
    } else {
      console.log(`Index already up to date (buildHash ${res.buildHash}). Nothing to rebuild.`);
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Build error:', err.message);
    process.exit(1);
  }
})();
