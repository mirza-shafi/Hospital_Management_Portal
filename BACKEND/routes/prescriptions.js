require('dotenv').config();
const express = require('express');
const Prescription = require('../models/Prescription');
const router = express.Router();

// Middleware to authenticate doctor
const authenticateDoctor = (req, res, next) => {
  const doctorEmail = req.headers['doctor-email'];
  if (!doctorEmail) {
    return res.status(400).send({ message: 'Doctor email is required' });
  }
  req.doctorEmail = doctorEmail;
  next();
};

// Create a new prescription
router.post('/create', async (req, res) => {
  const { doctorName, doctorEmail, date, patientEmail, patientName, age, sex, phoneNumber, prescriptionText } = req.body;

  try {
    const newPrescription = new Prescription({
      doctorName,
      doctorEmail,
      date,
      patientEmail,
      patientName,
      age,
      sex,
      phoneNumber,
      prescriptionText
    });

    await newPrescription.save();
    res.status(201).json({ message: 'Prescription sent to patient successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get prescriptions for a specific doctor
router.get('/dsearch', authenticateDoctor, async (req, res) => {
  const { query } = req.query;
  const doctorEmail = req.doctorEmail;

  try {
    const prescriptions = await Prescription.find({
      $and: [
        { doctorEmail: doctorEmail },
        {
          $or: [
            { patientEmail: { $regex: query, $options: 'i' } },
            { patientName: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    });
    res.json(prescriptions);
  } catch (err) {
    console.error('Error fetching prescriptions:', err);
    res.status(500).send({ message: 'Error fetching prescriptions' });
  }
});

// Middleware to authenticate patient
const authenticatePatient = (req, res, next) => {
  const patientEmail = req.headers['patient-email'];
  if (!patientEmail) {
    return res.status(400).send({ message: 'Patient email is required' });
  }
  req.patientEmail = patientEmail;
  next();
};

// Get prescriptions for a specific patient
router.get('/psearch', authenticatePatient, async (req, res) => {
  const { query } = req.query;
  const patientEmail = req.patientEmail;

  try {
    const prescriptions = await Prescription.find({
      patientEmail: patientEmail,
      $or: [
        { doctorEmail: { $regex: query, $options: 'i' } },
        { doctorName: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(prescriptions);
  } catch (err) {
    console.error('Error fetching prescriptions:', err);
    res.status(500).send({ message: 'Error fetching prescriptions' });
  }
});

// Count distinct patients by doctorEmail
router.get('/count-patients', async (req, res) => {
  try {
    const { doctorEmail } = req.query;

    const patientCount = await Prescription.aggregate([
      { $match: { doctorEmail } },
      { $group: { _id: "$patientEmail" } },
      { $count: "count" }
    ]);

    res.status(200).json({ count: patientCount[0]?.count || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
