const mongoose = require('mongoose');

const BloodRecipientSchema = new mongoose.Schema({
  firstName: {type: String,required: true},
  lastName: {type: String, required: true},
  gender: {type: String,required: true},
  email: {type: String,required: true,match: [/\S+@\S+\.\S+/, 'Please provide a valid email address.'] },
  phoneNumber: {type: String,required: true},
  bloodNeeded: {type: String,required: true,enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']},
  totalBagsNeeded: {
    type: Number,
    required: true,min: [1, 'At least one bag is required.'] }
  }, {
     timestamps: true});

const BloodRecipient = mongoose.model('BloodRecipient', BloodRecipientSchema);

module.exports = BloodRecipient;
