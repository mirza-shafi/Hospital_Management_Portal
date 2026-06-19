const express = require('express');
const router = express.Router();
const BloodAvailability = require('../models/BloodAvailability');
const { scheduleRebuild } = require('../services/ragChatbot');

// Route to get blood availability
router.get('/', async (req, res) => {
  try {
    const bloodAvailability = await BloodAvailability.find();
    res.status(200).json(bloodAvailability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again.' });
  }
});

// Add a new blood group entry (or no-op if it exists)
router.post('/', async (req, res) => {
  try {
    const { bloodGroup, count } = req.body;
    const existing = await BloodAvailability.findOne({ bloodGroup });
    if (existing) return res.status(400).json({ message: 'Blood group already exists.' });
    const created = await BloodAvailability.create({ bloodGroup, count: Number(count) || 0 });
    scheduleRebuild();
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again.' });
  }
});

// Update a blood group's unit count
router.put('/:id', async (req, res) => {
  try {
    const { count } = req.body;
    const updated = await BloodAvailability.findByIdAndUpdate(
      req.params.id,
      { count: Math.max(0, Number(count) || 0) },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Blood group not found.' });
    scheduleRebuild();
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again.' });
  }
});

// Delete a blood group entry
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await BloodAvailability.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Blood group not found.' });
    scheduleRebuild();
    res.json({ message: 'Blood group entry deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again.' });
  }
});

module.exports = router;
