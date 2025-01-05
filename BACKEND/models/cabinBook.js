const mongoose = require('mongoose');

const cabinBookingSchema = new mongoose.Schema({
  cabinType: { type: String, enum: ['single', 'double'], required: true },
  floor: { type: Number, required: true },
  cabinNo: { type: String, required: true },
  patientName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  totalDays: { type: Number, required: true },
  bookedDate: { type: Date, required: true },
  totalBill: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  paid: {type: Boolean, default: false }
});

module.exports = mongoose.model('CabinBook', cabinBookingSchema);
