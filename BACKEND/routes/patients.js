const express = require('express');
const bcrypt = require('bcryptjs');
const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; 
const validateRegistration = require('../middleware/registrationValidator');

// Ensure uploads/patients directory exists
const uploadDir = path.join(__dirname, '../uploads/patients');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
    console.log('🔐 Patient Login Attempt:');
    console.log('  Email:', email);
    console.log('  Password length:', password?.length);

    const patient = await Patient.findOne({ email });
    console.log('  Patient found:', patient ? 'YES' : 'NO');
    
    if (!patient) {
      console.log('  ❌ Patient not found in database');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('  Stored password hash:', patient.password?.substring(0, 20) + '...');
    const isMatch = await bcrypt.compare(password, patient.password);
    console.log('  Password match:', isMatch ? 'YES' : 'NO');
    
    if (!isMatch) {
      console.log('  ❌ Password does not match');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const payload = {
      patient: {
        id: patient.id
      }
    };

    console.log('  JWT_SECRET exists:', !!JWT_SECRET);
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    console.log('  ✅ Token generated successfully');
    console.log('  Token preview:', token.substring(0, 30) + '...');

    res.json({ token });
  } catch (error) {
    console.error('  ❌ Login error:', error);
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
// Update patient profile & health metrics
router.put('/pupdate', async (req, res) => {
  const { email, name, bloodGroup, age, difficulty, beendignosed, condition, weight, bloodPressure, bloodSugar, lastCheckup } = req.body;

  try {
    const updateData = { name, bloodGroup, age, difficulty, beendignosed, condition, weight, bloodPressure, bloodSugar, lastCheckup };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const patient = await Patient.findOneAndUpdate(
      { email },
      updateData,
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
        { name: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search
        { mobileNumber: { $regex: searchQuery, $options: 'i' } },
      ]
    }).select('name age sex mobileNumber bloodGroup difficulty beendignosed condition');

    if (patients.length === 0) {
      return res.status(404).json({ message: 'No patients found' });
    }

    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Update Theme
router.put('/update-theme', async (req, res) => {
  try {
    const { email, theme } = req.body;
    const patient = await Patient.findOneAndUpdate({ email }, { theme }, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Theme updated', theme: patient.theme });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change Password
router.put('/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, patient.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    patient.password = await bcrypt.hash(newPassword, salt);
    await patient.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Account
router.delete('/delete-account', async (req, res) => {
  try {
    const { email, password } = req.body; // Require password for deletion
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Verify password before deletion
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    await Patient.findOneAndDelete({ email });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Multer setup for patient profile pictures
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/patients'); 
  },
  filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// Route to upload profile picture
router.post('/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
      }

      const { email } = req.body;
      const patient = await Patient.findOne({ email });
      if (!patient) return res.status(404).json({ message: 'Patient not found' });

      // Update patient profile picture URL
      patient.profilePicture = `/uploads/patients/${req.file.filename}`;
      await patient.save();

      res.json({ profilePicture: patient.profilePicture });
  } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ message: 'Failed to upload profile picture.', error: error.message });
  }
});

module.exports = router;
