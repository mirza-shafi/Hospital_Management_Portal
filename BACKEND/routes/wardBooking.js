const express = require('express');
const router = express.Router();
const WardBook = require('../models/wardBook');
const HealthCard = require('../models/HealthCard');

// Endpoint to get available wards
router.get('/wavailable', async (req, res) => {
  try {
    const wards = await WardBook.find({ isBooked: false });
    res.json(wards);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Endpoint to book a ward
router.post('/wbook', async (req, res) => {
  const {
    wardType,
    floor,
    wardNo,
    patientName,
    email,
    phone,
    totalDays,
    bookedDate
  } = req.body;

  try {
    // Check if the ward is available
    const existingBooking = await WardBook.findOne({
      wardType,
      floor,
      wardNo,
      isBooked: true
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Selected ward is not available.' });
    }

    // Calculate total bill
    const totalBill = totalDays * 1500;

    // Create a new booking
    const newBooking = new WardBook({
      wardType,
      floor,
      wardNo,
      patientName,
      email,
      phone,
      totalDays,
      bookedDate,
      totalBill,
      isBooked: true
    });

    await newBooking.save();

    res.json({ message: 'Ward bookeds successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});
// Fetch ward bills by patient email
router.get('/ward-bills/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const wardBills = await WardBook.find({ email });
    res.json(wardBills);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Update the paid status for a ward bill
router.put('/pay-ward-bill/:id', async (req, res) => {
  const wardId = req.params.id;
  const { topUpAmount, email } = req.body;

  try {
    const ward = await WardBook.findById(wardId);
    const healthCard = await HealthCard.findOne({ email });

    if (!ward || !healthCard) {
      return res.status(404).json({ error: 'Ward or Health Card not found' });
    }

    if (ward.totalBill > healthCard.topUpAmount) {
      return res.status(400).json({ error: 'Insufficient points in health card' });
    }

    healthCard.topUpAmount -= ward.totalBill;
    ward.paid = true;
    
    await healthCard.save();
    await ward.save();

    res.json({ message: 'Bill paid successfully', ward });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Pay ward bill with health card points
router.put('/pay-ward-bill/:id', async (req, res) => {
  const { id } = req.params;
  const { topUpAmount, email } = req.body;

  try {
    const wardBill = await WardBooking.findById(id);
    if (!wardBill) {
      return res.status(404).json({ message: 'Ward bill not found' });
    }

    if (wardBill.paid) {
      return res.status(400).json({ message: 'Bill already paid' });
    }

    const healthCard = await HealthCard.findOne({ email });
    if (!healthCard) {
      return res.status(404).json({ message: 'Health card not found' });
    }

    if (healthCard.topUpAmount < wardBill.totalBill) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // Deduct points and mark the bill as paid
    healthCard.topUpAmount -= wardBill.totalBill;
    await healthCard.save();
    wardBill.paid = true;
    await wardBill.save();

    res.json({ message: 'Payment successful', card: healthCard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
