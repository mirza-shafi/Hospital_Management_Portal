const mongoose = require('mongoose');

const supportRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // Admin can update this
  solution: { type: String }, // Admin's response
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SupportRequest', supportRequestSchema);
