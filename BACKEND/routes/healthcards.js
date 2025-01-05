const express = require('express');
const router = express.Router();
const HealthCard = require('../models/HealthCard');

// Register a new health card
router.post('/register', async (req, res) => {
  const { patientName, email, phoneNumber, bloodGroup } = req.body;

  try {
    const existingCard = await HealthCard.findOne({ email });
    if (existingCard) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newCard = new HealthCard({ patientName, email, phoneNumber, bloodGroup });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch health card by email
router.get('/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const card = await HealthCard.findOne({ email });
    if (!card) {
      return res.status(404).json({ message: 'Health card not found' });
    }
    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Top-up points
router.put('/topup', async (req, res) => {
  const { topUpAmount } = req.body;
  const email = req.headers['authorization'];

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const card = await HealthCard.findOne({ email });
    if (!card) {
      return res.status(404).json({ message: 'Health card not found' });
    }

    const newAmount = card.topUpAmount + parseInt(topUpAmount, 10);
    if (newAmount > 50000) {
      return res.status(400).json({ message: 'Top-up amount exceeds the limit of 50,000 points' });
    }

    card.topUpAmount = newAmount;
    await card.save();
    res.json({ message: 'Top-up successful', card });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

