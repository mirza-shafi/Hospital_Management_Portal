const mongoose = require('mongoose');

const HealthCardSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  topUpAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model('HealthCard', HealthCardSchema);

