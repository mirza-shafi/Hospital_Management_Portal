const express = require('express');
const bcrypt = require('bcryptjs');
const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; 
const validateRegistration = require('../middleware/registrationValidator');

// Register Patient
router.post('/register', validateRegistration, async (req, res) => {
  try {
    console.log('Registration request body:', req.body); // Debug log

    const { name, email, password, sex, dateOfBirth, mobileNumber } = req.body;

    // Validate required fields
    if (!name || !email || !password || !sex || !dateOfBirth || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if patient already exists
    const existingPatient = await Patient.findOne({
      $or: [
        { email: email.toLowerCase() },
        { mobileNumber }
      ]
    });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: existingPatient.email === email.toLowerCase() ?
          'Email already registered' :
          'Mobile number already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new patient
    const patient = new Patient({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      sex,
      dateOfBirth,
      mobileNumber
    });

    // Save patient
    await patient.save();
    console.log('Patient saved successfully:', patient); // Debug log

    // Create JWT token
    const token = jwt.sign(
      { id: patient._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error registering patient',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Login a patient
router.post('/plogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const payload = {
      patient: {
        id: patient.id
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch patient details by email
router.get('/pdetails/email/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient profile
router.put('/pupdate', async (req, res) => {
  const { email, firstName, lastName, bloodGroup, age, difficulty, beendignosed, condition } = req.body;

  try {
    const patient = await Patient.findOneAndUpdate(
      { email },
      { firstName, lastName, bloodGroup, age, difficulty, beendignosed, condition },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Profile updated successfully', patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/pdetails/search', async (req, res) => {
  try {
    const { searchQuery } = req.query;
    const patients = await Patient.find({
      $or: [
        { firstName: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { mobileNumber: { $regex: searchQuery, $options: 'i' } },
      ]
    }).select('firstName lastName age sex mobileNumber bloodGroup difficulty beendignosed condition');

    if (patients.length === 0) {
      return res.status(404).json({ message: 'No patients found' });
    }

    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
