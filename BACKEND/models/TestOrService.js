const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testOrServiceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Test', 'Service'],
    required: true
  }
});

const TestOrService = mongoose.model('TestOrService', testOrServiceSchema);
module.exports = TestOrService;
