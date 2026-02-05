const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  sex: {
    type: String,
    required: [true, 'Sex is required'],
    enum: ['Male', 'Female', 'Other']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true
  },
  // Additional fields that might be needed later
  bloodGroup: { type: String },
  age: { type: Number },
  difficulty: { type: String },
  beendignosed: { type: String },
  condition: { type: String },
  // Health Metrics
  weight: { type: String, default: '--' },
  bloodPressure: { type: String, default: '--' },
  bloodSugar: { type: String, default: '--' },
  lastCheckup: { type: Date },
  // Clinical Data
  diagnosis: { type: String, default: 'General Checkup' },
  status: { type: String, enum: ['Stable', 'Mild', 'Critical'], default: 'Stable' },
  lastVisit: { type: String, default: () => new Date().toLocaleDateString() },
  // Settings
  theme: { type: String, default: 'light' },
  profilePicture: { type: String }
}, {
  timestamps: true
});

// Add a pre-save middleware to calculate age from dateOfBirth
patientSchema.pre('save', function(next) {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    this.age = age;
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
