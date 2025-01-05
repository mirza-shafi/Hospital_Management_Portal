const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sex: { type: String },
  dateOfBirth: { type: Date },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodGroup: { type: String },
  age: { type: Number },
  degrees: { type: String },
  institute: { type: String },
  specialty: { type: String },
  department: { type: String },
  availability: { type: String },
  createdAt: { type: Date, default: Date.now },
  profilePicture: { type: String } 
});

module.exports = mongoose.model('Doctor', DoctorSchema);
