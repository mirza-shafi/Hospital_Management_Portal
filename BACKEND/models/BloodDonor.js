const mongoose = require('mongoose');

const BloodDonorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  donatedBefore: { type: String, enum: ['yes', 'no'], required: true },
  lastDonationDate: { type: Date }
});

module.exports = mongoose.model('BloodDonor', BloodDonorSchema);
