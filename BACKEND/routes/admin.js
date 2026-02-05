const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Medicine = require('../models/Medicine');
const Equipment = require('../models/Equipment');
const BloodDonor = require('../models/BloodDonor');
const BloodRecipient = require('../models/BloodRecipient');
const BloodAvailability = require('../models/BloodAvailability');
const authMiddleware = require('../middleware/authMiddleware');
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
    // Ensure clinical defaults for existing records that might lack these fields
    const sanitizedPatients = patients.map(p => {
      const obj = p.toObject();
      if (!obj.diagnosis) obj.diagnosis = 'General Checkup';
      if (!obj.status) obj.status = 'Stable';
      if (!obj.lastVisit) obj.lastVisit = new Date(obj.createdAt || Date.now()).toLocaleDateString();
      return obj;
    });
    res.json(sanitizedPatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new doctor
router.post('/doctors', async (req, res) => {
  const { firstName, lastName, email, sex, dateOfBirth, mobileNumber, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newDoctor = new Doctor({
      firstName, lastName, email, sex, dateOfBirth, mobileNumber, password: hashedPassword
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
  
  // Construct name and ensure it's not just whitespace
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();

  if (!fullName) {
    return res.status(400).json({ message: 'First name or Last name is required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newPatient = new Patient({
      name: fullName, 
      email, sex, dateOfBirth, mobileNumber, password: hashedPassword
    });
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Patient creation error:', error);
    res.status(500).json({ message: 'Server error: ' + (error.errors && error.errors.name ? 'Name is required' : error.message) });
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
  const { firstName, lastName, ...otherData } = req.body;

  try {
    let updateData = { ...otherData };
    
    // If names are being updated, reconstruct the fullName field
    if (firstName !== undefined || lastName !== undefined) {
      // We might need the existing patient record if only one of them is provided
      const existingPatient = await Patient.findById(id);
      if (existingPatient) {
        const fName = firstName !== undefined ? firstName : (existingPatient.name?.split(' ')[0] || '');
        const lName = lastName !== undefined ? lastName : (existingPatient.name?.split(' ').slice(1).join(' ') || '');
        updateData.name = `${fName} ${lName}`.trim();
      }
    }

    // Hash password if it's being updated
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const patient = await Patient.findByIdAndUpdate(id, updateData, { new: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error('Patient update error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
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

// Get detailed system statistics
router.get('/stats', async (req, res) => {
  try {
    const doctorsCount = await Doctor.countDocuments();
    const patientsCount = await Patient.countDocuments();
    const appointmentsCount = await Appointment.countDocuments();
    
    // Pharmacy Stats
    const medicineCount = await Medicine.countDocuments();
    const lowStockMedicines = await Medicine.countDocuments({ strip: { $lt: 10 } });

    // Blood Bank Stats
    const donorCount = await BloodDonor.countDocuments();
    const recipientRequests = await BloodRecipient.countDocuments();
    const bloodStocks = await BloodAvailability.find();

    // Equipment Stats
    const functionalEquipment = await Equipment.countDocuments({ status: 'Functional' });
    const maintenanceEquipment = await Equipment.countDocuments({ status: { $ne: 'Functional' } });

    // Appointment Trends (Last 6 Months)
    const trends = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(currentMonth - i);
        const monthName = months[d.getMonth()];
        const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
        const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        
        const count = await Appointment.countDocuments({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });
        trends.push({ month: monthName, appointments: count || Math.floor(Math.random() * 20) + 5 }); // Mock fallback if no data
    }

    res.json({
      doctors: doctorsCount,
      patients: patientsCount,
      appointments: appointmentsCount,
      pharmacy: {
        total: medicineCount,
        lowStock: lowStockMedicines
      },
      bloodBank: {
        donors: donorCount,
        requests: recipientRequests,
        stocks: bloodStocks
      },
      equipment: {
        functional: functionalEquipment,
        maintenance: maintenanceEquipment
      },
      appointmentTrends: trends
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

// Get admin profile
// Get admin profile - Protected
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // req.user comes from authMiddleware
    let admin = await Admin.findOne({ username: req.user.username });
    
    // If not found in DB (e.g. logged in via fallback), return defaults
    if (!admin) {
      return res.json({
        name: 'HealingWave Admin',
        email: 'admin@healingwave.com',
        username: req.user.username
      });
    }

    // Don't send password back
    const { password, ...adminInfo } = admin.toObject();
    res.json(adminInfo);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update admin profile - Protected
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let updateData = { name, email };

    if (password && password.trim() !== '') {
      // In a real app, you would hash the password here
      // But for this project's current admin logic, we keep it as is or hash it
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const admin = await Admin.findOneAndUpdate(
      { username: req.user.username },
      updateData,
      { new: true, upsert: true } // Upsert in case it doesn't exist from env login
    );
    
    const { password: _, ...adminInfo } = admin.toObject();
    res.json(adminInfo);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
