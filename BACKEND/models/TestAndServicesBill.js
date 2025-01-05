const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testAndServicesBillSchema = new Schema({
  doctorName: {
    type: String,
    required: true
  },
  doctorEmail: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientEmail: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  selectedItems: [
    {
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
    }
  ],
  totalBill: {
    type: Number,
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const TestAndServicesBill = mongoose.model('TestAndServicesBill', testAndServicesBillSchema);
module.exports = TestAndServicesBill;
