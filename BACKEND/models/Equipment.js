const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Diagnostic', 'Therapeutic', 'Life Support', 'Monitoring', 'Laboratory', 'Other']
  },
  serialNumber: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['Functional', 'Maintenance', 'Under Repair', 'Decommissioned'],
    default: 'Functional'
  },
  lastMaintenance: {
    type: Date,
    default: Date.now
  },
  description: String,
  location: String,
  purchaseDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Equipment', equipmentSchema);
