// Seed blood availability (all 8 groups) and 10 blood donors.
// Usage: node scripts/seedBlood.js
require('dotenv').config();
const mongoose = require('mongoose');
const BloodAvailability = require('../models/BloodAvailability');
const BloodDonor = require('../models/BloodDonor');

const availability = [
  { bloodGroup: 'O+', count: 42 },
  { bloodGroup: 'A+', count: 35 },
  { bloodGroup: 'B+', count: 28 },
  { bloodGroup: 'AB+', count: 14 },
  { bloodGroup: 'O-', count: 9 },
  { bloodGroup: 'A-', count: 7 },
  { bloodGroup: 'B-', count: 6 },
  { bloodGroup: 'AB-', count: 3 },
];

const donors = [
  { firstName: 'Rafiq', lastName: 'Islam', gender: 'male', email: 'rafiq.islam@example.com', phoneNumber: '+8801711000001', bloodGroup: 'O+', donatedBefore: 'yes', lastDonationDate: new Date('2026-03-10') },
  { firstName: 'Sadia', lastName: 'Noor', gender: 'female', email: 'sadia.noor@example.com', phoneNumber: '+8801711000002', bloodGroup: 'A+', donatedBefore: 'no' },
  { firstName: 'Hasan', lastName: 'Mahmud', gender: 'male', email: 'hasan.mahmud@example.com', phoneNumber: '+8801711000003', bloodGroup: 'B+', donatedBefore: 'yes', lastDonationDate: new Date('2026-01-22') },
  { firstName: 'Mitu', lastName: 'Akter', gender: 'female', email: 'mitu.akter@example.com', phoneNumber: '+8801711000004', bloodGroup: 'AB+', donatedBefore: 'no' },
  { firstName: 'Kamal', lastName: 'Hossain', gender: 'male', email: 'kamal.hossain@example.com', phoneNumber: '+8801711000005', bloodGroup: 'O-', donatedBefore: 'yes', lastDonationDate: new Date('2025-12-05') },
  { firstName: 'Nusrat', lastName: 'Jahan', gender: 'female', email: 'nusrat.jahan@example.com', phoneNumber: '+8801711000006', bloodGroup: 'A-', donatedBefore: 'no' },
  { firstName: 'Tariq', lastName: 'Aziz', gender: 'male', email: 'tariq.aziz@example.com', phoneNumber: '+8801711000007', bloodGroup: 'B-', donatedBefore: 'yes', lastDonationDate: new Date('2026-02-18') },
  { firstName: 'Farhana', lastName: 'Sultana', gender: 'female', email: 'farhana.sultana@example.com', phoneNumber: '+8801711000008', bloodGroup: 'AB-', donatedBefore: 'no' },
  { firstName: 'Jamil', lastName: 'Uddin', gender: 'male', email: 'jamil.uddin@example.com', phoneNumber: '+8801711000009', bloodGroup: 'O+', donatedBefore: 'yes', lastDonationDate: new Date('2026-04-01') },
  { firstName: 'Rumana', lastName: 'Haque', gender: 'female', email: 'rumana.haque@example.com', phoneNumber: '+8801711000010', bloodGroup: 'A+', donatedBefore: 'yes', lastDonationDate: new Date('2026-03-28') },
];

(async () => {
  try {
    if (!process.env.ATLAS_URI) throw new Error('ATLAS_URI not set');
    await mongoose.connect(process.env.ATLAS_URI);
    console.log('Connected to MongoDB');

    // Blood availability: upsert by group (idempotent)
    for (const a of availability) {
      await BloodAvailability.findOneAndUpdate(
        { bloodGroup: a.bloodGroup },
        { $set: { count: a.count } },
        { upsert: true, new: true }
      );
      console.log(`~ Availability set: ${a.bloodGroup} = ${a.count} bags`);
    }

    // Donors: insert if email not present
    let donorsInserted = 0;
    for (const d of donors) {
      const exists = await BloodDonor.findOne({ email: d.email });
      if (exists) { console.log(`- Donor exists: ${d.email}`); continue; }
      await new BloodDonor(d).save();
      donorsInserted++;
      console.log(`+ Donor inserted: ${d.firstName} ${d.lastName} (${d.bloodGroup})`);
    }

    const availCount = await BloodAvailability.countDocuments();
    const donorCount = await BloodDonor.countDocuments();
    console.log(`\nDone. Availability groups: ${availCount}, Donors inserted now: ${donorsInserted}, Total donors: ${donorCount}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
})();
