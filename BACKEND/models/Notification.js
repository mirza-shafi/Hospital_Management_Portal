const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  patientEmail: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['reminder', 'appointment', 'tip'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
