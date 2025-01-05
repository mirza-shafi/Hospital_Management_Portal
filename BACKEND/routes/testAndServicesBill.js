const express = require('express');
const router = express.Router();
const TestAndServicesBill = require('../models/TestAndServicesBill');
const HealthCard = require('../models/HealthCard');

// Create a new bill
router.post('/add', async (req, res) => {
  try {
    const {
      doctorName,
      doctorEmail,
      patientName,
      patientEmail,
      phoneNumber,
      selectedItems
    } = req.body;

    if (!doctorName || !doctorEmail || !patientName || !patientEmail || !phoneNumber || !selectedItems) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newBill = new TestAndServicesBill({
      doctorName,
      doctorEmail,
      patientName,
      patientEmail,
      phone: phoneNumber,
      selectedItems,
      totalBill: selectedItems.reduce((total, item) => total + item.price, 0)
    });

    await newBill.save();
    res.status(201).json({ message: 'Bill sent to the patient succesfully' });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(400).json({ error: 'Failed to add bill' });
  }
});

// Fetch bills by patient email
router.get('/bills/:email', async (req, res) => {
  try {
    const bills = await TestAndServicesBill.find({ patientEmail: req.params.email });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

// Pay for a bill and update health card
router.put('/pay/:id', async (req, res) => {
  try {
    const { email, topUpAmount } = req.body;

    // Fetch the bill
    const bill = await TestAndServicesBill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Fetch the health card
    const healthCard = await HealthCard.findOne({ email });
    if (!healthCard) {
      return res.status(404).json({ error: 'Health card not found' });
    }

    // Check if the card has enough balance
    if (bill.totalBill > healthCard.topUpAmount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Update the bill status
    bill.paid = true;
    await bill.save();

    // Deduct points from the health card
    healthCard.topUpAmount -= bill.totalBill;
    await healthCard.save();

    res.json({ message: 'Payment successful', bill });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

module.exports = router;
