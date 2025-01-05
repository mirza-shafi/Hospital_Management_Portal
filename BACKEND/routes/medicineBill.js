const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const MedicineBill = require('../models/MedicineBill');
const HealthCard = require('../models/HealthCard'); 

// Purchase medicines
router.post('/buy', async (req, res) => {
  const { name, email, phoneNumber, address, selectedMedicines } = req.body;

  try {
    let totalBill = 0;
    const billDetails = [];

    // Validate selected medicines and update stock
    for (const item of selectedMedicines) {
      const { medicineId, quantity } = item;
      const medicine = await Medicine.findById(medicineId);

      if (!medicine || medicine.strip < quantity) {
        return res.status(400).json({ message: `Medicine ${medicineId} is out of stock or quantity exceeds available stock` });
      }

      // Update stock
      medicine.strip -= quantity;
      await medicine.save();

      // Calculate total price
      const totalPrice = medicine.price * quantity;
      totalBill += totalPrice;

      // Store bill details
      billDetails.push({
        medicineId,
        quantity,
        totalPrice,
      });
    }

    // Save bill to database
    const newBill = new MedicineBill({
      name,
      email,
      phoneNumber,
      address,
      medicines: billDetails,
      totalBill,
      paid: false // Initially unpaid
    });
    await newBill.save();

    res.status(201).json({ message: 'Bill submitted', totalBill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bills by email
router.get('/bills/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const bills = await MedicineBill.find({ email }).populate('medicines.medicineId', 'name price'); // Populate medicine details
    if (!bills.length) {
      return res.status(404).json({ message: 'No bills found for this email.' });
    }
    res.status(200).json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Pay bill with health card points
router.put('/pay/:billId', async (req, res) => {
  const { billId } = req.params;
  const { email } = req.body; // Email used to identify the health card

  try {
    // Fetch the bill and health card
    const bill = await MedicineBill.findById(billId);
    const healthCard = await HealthCard.findOne({ email });

    if (!bill || !healthCard) {
      return res.status(404).json({ message: 'Bill or Health Card not found' });
    }

    if (bill.paid) {
      return res.status(400).json({ message: 'Bill already paid' });
    }

    if (bill.totalBill > healthCard.topUpAmount) {
      return res.status(400).json({ message: 'Insufficient points in health card' });
    }

    // Deduct points from health card
    healthCard.topUpAmount -= bill.totalBill;
    await healthCard.save();

    // Mark the bill as paid
    bill.paid = true;
    await bill.save();

    res.status(200).json({ message: 'Bill paid successfully', bill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
