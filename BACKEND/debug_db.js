const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');

// Use the host-mapped port 27018
const uri = 'mongodb://localhost:27018/hospital_db';

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to DB');
    const doctors = await Doctor.find({});
    console.log('Doctors found:', doctors.length);
    doctors.forEach(d => {
      console.log({
        id: d._id,
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        mobileNumber: d.mobileNumber,
      });
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
