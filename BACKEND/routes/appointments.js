const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const HealthCard = require('../models/HealthCard');

// Get all distinct departments
router.get('/departments', async (req, res) => {
    try {
        const departments = await Doctor.distinct('department');
        res.json(departments);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get doctors by department
router.get('/doctors/:department', async (req, res) => {
    try {
        const doctors = await Doctor.find({ department: req.params.department });
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get doctor by ID (to fetch email and name)
router.get('/doctor/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create an appointment
router.post('/', async (req, res) => {
    const { department, doctor, date, timeSlot, patientName, patientEmail, patientPhone } = req.body;

    try {
        // Fetch doctor's details
        const doctorDetails = await Doctor.findById(doctor);
        if (!doctorDetails) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Check if an appointment already exists for the same doctor on the same date and time slot
        const existingDoctorAppointment = await Appointment.findOne({ doctor, date, timeSlot });
        if (existingDoctorAppointment) {
            return res.status(400).json({ error: 'This time slot is already booked with this doctor.' });
        }

        // Check if the same patient already has an appointment on the same date and time slot
        const existingPatientAppointment = await Appointment.findOne({ patientEmail, date, timeSlot });
        if (existingPatientAppointment) {
            return res.status(400).json({ error: 'You already have an appointment at this time and date.' });
        }

        // Create and save the appointment
        const newAppointment = new Appointment({
            department,
            doctor,
            doctorName: `${doctorDetails.firstName} ${doctorDetails.lastName}`,
            doctorEmail: doctorDetails.email,
            date,
            timeSlot,
            patientName,
            patientEmail,
            patientPhone,
        });

        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get appointments by doctor email
router.get('/doctor/email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const appointments = await Appointment.find({ doctorEmail: email });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get appointments by patient email
router.get('/patient/email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const appointments = await Appointment.find({ patientEmail: email });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Route to get the total number of appointments for a specific doctor
router.get('/count/:doctorEmail', async (req, res) => {
  try {
    const { doctorEmail } = req.params;
    const count = await Appointment.countDocuments({ doctorEmail });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get today's appointments for a specific doctor
router.get('/today-appointments', async (req, res) => {
    try {
      const doctorEmail = req.query.doctorEmail;
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
      const appointments = await Appointment.find({
        doctorEmail,
        date: { $gte: startOfDay, $lte: endOfDay }
      }).sort({ time: 1 }); 
  
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
// Request payment
router.put('/request-payment/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        if (appointment.paymentRequest === 'requested') {
            return res.status(400).json({ error: 'Payment already requested' });
        }

        appointment.paymentRequest = 'requested';
        await appointment.save();

        res.json({ message: 'Payment request has been sent' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Pay with health card
router.put('/pay/:id', async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    try {
        const appointment = await Appointment.findById(id);
        const healthCard = await HealthCard.findOne({ email });

        if (!appointment || !healthCard) {
            return res.status(404).json({ error: 'Appointment or Health Card not found' });
        }

        if (appointment.paidStatus === 'paid') {
            return res.status(400).json({ error: 'Appointment already paid' });
        }

        if (healthCard.topUpAmount < 1000) {
            return res.status(400).json({ error: 'Insufficient points in health card' });
        }

        healthCard.topUpAmount -= 1000;
        appointment.paidStatus = 'paid';
        appointment.status = 'completed';
        appointment.paymentRequest = 'requested';

        await healthCard.save();
        await appointment.save();

        res.json({ message: 'Payment successful', appointment });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
