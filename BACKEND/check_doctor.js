const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const DoctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sex: { type: String },
  dateOfBirth: { type: Date },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodGroup: { type: String },
  age: { type: Number },
  degrees: { type: String },
  institute: { type: String },
  specialty: { type: String },
  department: { type: String },
  availability: { type: String },
  createdAt: { type: Date, default: Date.now },
  profilePicture: { type: String }
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

async function checkDoctor() {
  try {
    const ATLAS_URI = process.env.ATLAS_URI || 'mongodb://localhost:27017/hospital_db';
    console.log('Connecting to:', ATLAS_URI);
    
    await mongoose.connect(ATLAS_URI);
    console.log('✓ Connected to MongoDB\n');

    // Check if doctor exists
    const email = 'john@gmail.com';
    const doctor = await Doctor.findOne({ email });
    
    if (!doctor) {
      console.log(`❌ No doctor found with email: ${email}`);
      console.log('\nLet me check all doctors in the database:');
      const allDoctors = await Doctor.find({});
      console.log(`Total doctors: ${allDoctors.length}`);
      allDoctors.forEach((doc, index) => {
        console.log(`\n${index + 1}. Email: ${doc.email}`);
        console.log(`   Name: ${doc.firstName} ${doc.lastName}`);
        console.log(`   Mobile: ${doc.mobileNumber}`);
      });
    } else {
      console.log(`✓ Doctor found!`);
      console.log(`Name: ${doctor.firstName} ${doctor.lastName}`);
      console.log(`Email: ${doctor.email}`);
      console.log(`Mobile: ${doctor.mobileNumber}`);
      console.log(`Created: ${doctor.createdAt}`);
      console.log(`\nPassword hash: ${doctor.password}`);
      
      // Test password
      const testPassword = 'password123';
      const isMatch = await bcrypt.compare(testPassword, doctor.password);
      console.log(`\nPassword test with '${testPassword}': ${isMatch ? '✓ MATCH' : '❌ NO MATCH'}`);
      
      if (!isMatch) {
        console.log('\nTrying to check if password is stored as plain text...');
        if (doctor.password === testPassword) {
          console.log('⚠️  WARNING: Password is stored as PLAIN TEXT!');
        } else {
          console.log('Password is hashed but does not match the test password.');
        }
      }
    }

    await mongoose.connection.close();
    console.log('\n✓ Connection closed');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkDoctor();
