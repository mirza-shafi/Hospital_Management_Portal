const mongoose = require('mongoose');

// Persistent vector store for parent-child RAG.
// Each document is a CHILD chunk (fine-grained, embedded) that links back to
// its PARENT document (coarse context returned to the LLM).
const KnowledgeChunkSchema = new mongoose.Schema({
  parentId: { type: String, required: true, index: true },
  type: { type: String },           // doctor | medicine | blood | static
  title: { type: String },          // parent title
  parentText: { type: String, required: true },
  childText: { type: String, required: true },
  embedding: { type: [Number], required: true }, // 384-dim
  buildHash: { type: String, index: true },       // KB version this chunk belongs to
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeChunk', KnowledgeChunkSchema);
