const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, default: 'HealingWave Admin' },
  email: { type: String, default: 'admin@healingwave.com' },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
