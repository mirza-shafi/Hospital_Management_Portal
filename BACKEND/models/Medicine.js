const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genericName: { type: String, required: true },
  dosageForm: { type: String, required: true },
  strength: { type: String, required: true },
  price: { type: Number, required: true },
  strip: { type: Number, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: false },
  image: { type: String, required: true }, 
});

module.exports = mongoose.model('Medicine', medicineSchema);
