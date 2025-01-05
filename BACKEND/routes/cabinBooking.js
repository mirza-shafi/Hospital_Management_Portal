const express = require('express');
const router = express.Router();
const CabinBooking = require('../models/cabinBook');
const HealthCard = require('../models/HealthCard');

// Endpoint to get available cabins
router.get('/cavailable', async (req, res) => {
  try {
    const cabins = await CabinBooking.find({ isBooked: false });
    res.json(cabins);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Endpoint to book a cabin
router.post('/cbook', async (req, res) => {
  const {
    cabinType,
    floor,
    cabinNo,
    patientName,
    email,
    phone,
    totalDays,
    bookedDate
  } = req.body;

  try {
    // Check if the cabin is available
    const existingBooking = await CabinBooking.findOne({
      cabinType,
      floor,
      cabinNo,
      isBooked: true
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Selected cabin is not available.' });
    }

    // Calculate total bill
    const totalBill = totalDays * (cabinType === 'single' ? 2000 : 2500);

    // Create a new booking
    const newBooking = new CabinBooking({
      cabinType,
      floor,
      cabinNo,
      patientName,
      email,
      phone,
      totalDays,
      bookedDate,
      totalBill,
      isBooked: true
    });

    await newBooking.save();

    res.json({ message: 'Cabin booked successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});
// Fetch cabin bills by patient email
router.get('/cabin-bills/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const cabinBills = await CabinBooking.find({ email });
    res.json(cabinBills);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Update the paid status for a cabin bill
router.put('/pay-cabin-bill/:id', async (req, res) => {
  const cabinId = req.params.id;
  const { topUpAmount, email } = req.body;

  try {
    const cabin = await CabinBooking.findById(cabinId);
    const healthCard = await HealthCard.findOne({ email });

    if (!cabin || !healthCard) {
      return res.status(404).json({ error: 'Cabin or Health Card not found' });
    }

    if (cabin.totalBill > healthCard.topUpAmount) {
      return res.status(400).json({ error: 'Insufficient points in health card' });
    }

    healthCard.topUpAmount -= cabin.totalBill;
    cabin.paid = true;
    
    await healthCard.save();
    await cabin.save();

    res.json({ message: 'Bill paid successfully', cabin });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});
// Pay cabin bill with health card points
router.put('/pay-cabin-bill/:id', async (req, res) => {
  const { id } = req.params;
  const { topUpAmount, email } = req.body;

  try {
    const cabinBill = await CabinBooking.findById(id);
    if (!cabinBill) {
      return res.status(404).json({ message: 'Cabin bill not found' });
    }

    if (cabinBill.paid) {
      return res.status(400).json({ message: 'Bill already paid' });
    }

    const healthCard = await HealthCard.findOne({ email });
    if (!healthCard) {
      return res.status(404).json({ message: 'Health card not found' });
    }

    if (healthCard.topUpAmount < cabinBill.totalBill) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // Deduct points and mark the bill as paid
    healthCard.topUpAmount -= cabinBill.totalBill;
    await healthCard.save();
    cabinBill.paid = true;
    await cabinBill.save();

    res.json({ message: 'Payment successful', card: healthCard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
