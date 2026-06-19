// Seed 10 diverse doctors into MongoDB Atlas.
// Usage: node scripts/seedDoctors.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Doctor = require('../models/Doctor');

const DEFAULT_PASSWORD = 'doctor123';

const doctors = [
  {
    firstName: 'Ayesha', lastName: 'Rahman', email: 'ayesha.rahman@healingwave.com',
    sex: 'Female', mobileNumber: '+8801710000001', bloodGroup: 'A+', age: 44,
    degrees: 'MBBS, FCPS (Cardiology), FACC', institute: 'Dhaka Medical College',
    specialty: 'Interventional Cardiologist', department: 'Cardiology',
    availability: 'Sun, Tue, Thu — 10:00 AM to 1:00 PM',
    profilePicture: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    firstName: 'Imran', lastName: 'Hossain', email: 'imran.hossain@healingwave.com',
    sex: 'Male', mobileNumber: '+8801710000002', bloodGroup: 'B+', age: 51,
    degrees: 'MBBS, MD (Neurology), MRCP (UK)', institute: 'BSMMU',
    specialty: 'Consultant Neurologist', department: 'Neurology',
    availability: 'Mon, Wed, Sat — 4:00 PM to 8:00 PM',
    profilePicture: 'https://randomuser.me/api/portraits/men/52.jpg',
  },
  {
    firstName: 'Tania', lastName: 'Akter', email: 'tania.akter@healingwave.com',
    sex: 'Female', mobileNumber: '+8801710000003', bloodGroup: 'O+', age: 39,
    degrees: 'MBBS, DGO, FCPS (Gynaecology & Obstetrics)', institute: 'Sir Salimullah Medical College',
    specialty: 'Gynaecologist & Obstetrician', department: 'Gynaecology',
    availability: 'Sun to Thu — 9:00 AM to 12:00 PM',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    firstName: 'Sajid', lastName: 'Karim', email: 'sajid.karim@healingwave.com',
    sex: 'Male', mobileNumber: '+8801710000004', bloodGroup: 'AB+', age: 47,
    degrees: 'MBBS, MS (Orthopaedics)', institute: 'NITOR, Dhaka',
    specialty: 'Orthopaedic & Joint Replacement Surgeon', department: 'Orthopaedics',
    availability: 'Tue, Thu, Sat — 5:00 PM to 9:00 PM',
    profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    firstName: 'Nadia', lastName: 'Islam', email: 'nadia.islam@healingwave.com',
    sex: 'Female', mobileNumber: '+8801710000005', bloodGroup: 'A-', age: 36,
    degrees: 'MBBS, DCH, FCPS (Paediatrics)', institute: 'Chittagong Medical College',
    specialty: 'Paediatrician & Neonatologist', department: 'Paediatrics',
    availability: 'Sun, Mon, Wed — 10:00 AM to 2:00 PM',
    profilePicture: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    firstName: 'Rakib', lastName: 'Chowdhury', email: 'rakib.chowdhury@healingwave.com',
    sex: 'Male', mobileNumber: '+8801710000006', bloodGroup: 'B-', age: 42,
    degrees: 'MBBS, DDV, MD (Dermatology)', institute: 'BSMMU',
    specialty: 'Dermatologist & Cosmetologist', department: 'Dermatology',
    availability: 'Mon, Wed, Fri — 3:00 PM to 7:00 PM',
    profilePicture: 'https://randomuser.me/api/portraits/men/76.jpg',
  },
  {
    firstName: 'Farzana', lastName: 'Haque', email: 'farzana.haque@healingwave.com',
    sex: 'Female', mobileNumber: '+8801710000007', bloodGroup: 'O-', age: 49,
    degrees: 'MBBS, MD (Oncology), FRCR', institute: 'National Cancer Institute',
    specialty: 'Medical Oncologist', department: 'Oncology',
    availability: 'Sun, Tue — 11:00 AM to 3:00 PM',
    profilePicture: 'https://randomuser.me/api/portraits/women/90.jpg',
  },
  {
    firstName: 'Mahmud', lastName: 'Alam', email: 'mahmud.alam@healingwave.com',
    sex: 'Male', mobileNumber: '+8801710000008', bloodGroup: 'A+', age: 55,
    degrees: 'MBBS, FCPS (Medicine), MRCP', institute: 'Dhaka Medical College',
    specialty: 'Consultant — Internal Medicine', department: 'General Medicine',
    availability: 'Daily — 6:00 PM to 9:00 PM',
    profilePicture: 'https://randomuser.me/api/portraits/men/41.jpg',
  },
  {
    firstName: 'Sumaiya', lastName: 'Khan', email: 'sumaiya.khan@healingwave.com',
    sex: 'Female', mobileNumber: '+8801710000009', bloodGroup: 'AB-', age: 38,
    degrees: 'MBBS, DLO, FCPS (ENT)', institute: 'Sir Salimullah Medical College',
    specialty: 'ENT & Head-Neck Surgeon', department: 'ENT',
    availability: 'Mon, Thu, Sat — 4:00 PM to 8:00 PM',
    profilePicture: 'https://randomuser.me/api/portraits/women/12.jpg',
  },
  {
    firstName: 'Tanvir', lastName: 'Ahmed', email: 'tanvir.ahmed@healingwave.com',
    sex: 'Male', mobileNumber: '+8801710000010', bloodGroup: 'O+', age: 46,
    degrees: 'MBBS, DO, FCPS (Ophthalmology)', institute: 'Ispahani Islamia Eye Institute',
    specialty: 'Ophthalmologist & Phaco Surgeon', department: 'Ophthalmology',
    availability: 'Sun, Wed, Fri — 9:00 AM to 1:00 PM',
    profilePicture: 'https://randomuser.me/api/portraits/men/15.jpg',
  },
];

(async () => {
  try {
    if (!process.env.ATLAS_URI) throw new Error('ATLAS_URI not set');
    await mongoose.connect(process.env.ATLAS_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    let inserted = 0, skipped = 0;

    for (const d of doctors) {
      const exists = await Doctor.findOne({ $or: [{ email: d.email }, { mobileNumber: d.mobileNumber }] });
      if (exists) {
        console.log(`- Skipped (exists): ${d.firstName} ${d.lastName}`);
        skipped++;
        continue;
      }
      await new Doctor({ ...d, password: hashedPassword }).save();
      console.log(`+ Inserted: Dr. ${d.firstName} ${d.lastName} (${d.department})`);
      inserted++;
    }

    const total = await Doctor.countDocuments();
    console.log(`\nDone. Inserted ${inserted}, skipped ${skipped}. Total doctors in DB: ${total}`);
    console.log(`Default login password for seeded doctors: "${DEFAULT_PASSWORD}"`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
})();
