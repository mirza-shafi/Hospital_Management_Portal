
const mongoose = require('mongoose');

const MedicineBillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  medicines: [
    {
      medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      totalPrice: {
        type: Number,
        required: true
      }
    }
  ],
  totalBill: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  paid: {type: Boolean, default: false }
});

const MedicineBill = mongoose.model('MedicineBill', MedicineBillSchema);

module.exports = MedicineBill;

