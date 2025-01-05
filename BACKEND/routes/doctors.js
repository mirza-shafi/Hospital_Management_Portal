const express = require('express');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
require('dotenv').config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/doctors'); 
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Register a new doctor
router.post('/dregister', async (req, res) => {
    const { firstName, lastName, email, sex, dateOfBirth, mobileNumber, password } = req.body;

    try {
        const existingDoctor = await Doctor.findOne({ $or: [{ email }, { mobileNumber }] });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Email or mobile number already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newDoctor = new Doctor({
            firstName,
            lastName,
            email,
            sex,
            dateOfBirth,
            mobileNumber,
            password: hashedPassword
        });

        await newDoctor.save();
        res.status(201).json({ message: 'Doctor registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login a doctor
router.post('/dlogin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const payload = {
            doctor: {
                id: doctor.id
            }
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to fetch doctor details by email
router.get('/ddetails/email/:email', async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ email: req.params.email });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update doctor profile
router.put('/dupdate', async (req, res) => {
    const { email, firstName, lastName, bloodGroup, age, degrees, institute, specialty, department, availability } = req.body;

    try {
        const doctor = await Doctor.findOneAndUpdate(
            { email },
            { firstName, lastName, bloodGroup, age, degrees, institute, specialty, department, availability },
            { new: true }
        );

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json({ message: 'Profile updated successfully', doctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to fetch all doctors, optionally filter by department
router.get('/all', async (req, res) => {
    try {
        const department = req.query.department;
        const query = department ? { department } : {};
        const doctors = await Doctor.find(query).sort({ department: 1 });
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to upload profile picture
router.post('/upload-profile-pic/:id', upload.single('profilePicture'), async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        // Update doctor profile picture URL
        doctor.profilePicture = `/uploads/doctors/${req.file.filename}`;
        await doctor.save();

        res.json({ profilePicture: doctor.profilePicture });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ message: 'Failed to upload profile picture.' });
    }
});
router.get('/profilepic/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor || !doctor.profilePicture) {
            return res.status(404).json({ message: 'Profile picture not found' });
        }

        // Send the profile picture file as a response
        const profilePicPath = path.join(__dirname, '..', doctor.profilePicture);
        res.sendFile(profilePicPath);
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        res.status(500).json({ message: 'Failed to fetch profile picture.' });
    }
});


module.exports = router;
