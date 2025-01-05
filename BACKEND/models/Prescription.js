const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
 
  doctorName: { type: String, required: true },
  doctorEmail: { type: String, required: true },
  date: { type: Date, required: true },
  patientEmail: { type: String, required: true },
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  prescriptionText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
