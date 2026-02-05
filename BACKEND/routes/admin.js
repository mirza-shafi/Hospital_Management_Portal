const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const router = express.Router();
require('dotenv').config();

// Loaded from environment variables for security
const adminCredentials = { 
  username: process.env.ADMIN_USERNAME || 'admin', 
  password: process.env.ADMIN_PASSWORD || 'admin' 
};

// Use the JWT secret key from .env
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Admin login attempt with username:', username);
  console.log('Expected username:', adminCredentials.username);
  
  try {
    // 1. Check Database First
    const admin = await Admin.findOne({ username });
    
    if (admin) {
        // In a real app, compare hashed passwords here (e.g., bcrypt.compare)
        if (admin.password === password) {
             const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
             console.log('Admin login successful (DB) for:', username);
             return res.json({ message: 'Login successful', token });
        }
    }

    // 2. Fallback to Environment Custom Variables (Legacy/Backup)
    if (username === adminCredentials.username && password === adminCredentials.password) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
      console.log('Admin login successful (Env) for:', username);
      res.json({ message: 'Login successful', token });
    } else {
      console.log('Admin login failed - invalid credentials');
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Fetch all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all patients
router.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new doctor
router.post('/doctors', async (req, res) => {
  const { firstName, lastName, email, sex, dateOfBirth, mobileNumber, password } = req.body;
  try {
    const newDoctor = new Doctor({
      firstName, lastName, email, sex, dateOfBirth, mobileNumber, password
    });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new patient
router.post('/patients', async (req, res) => {
  const { firstName, lastName, email, sex, dateOfBirth, mobileNumber, password } = req.body;
  try {
    const newPatient = new Patient({
      firstName, lastName, email, sex, dateOfBirth, mobileNumber, password
    });
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a doctor by ID
router.put('/doctors/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const doctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a patient by ID
router.put('/patients/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const patient = await Patient.findByIdAndUpdate(id, updateData, { new: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a doctor by ID
router.delete('/doctors/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a patient by ID
router.delete('/patients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
