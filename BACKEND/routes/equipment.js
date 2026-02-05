const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

// Get all equipment
router.get('/', async (req, res) => {
  try {
    const equipment = await Equipment.find().sort({ createdAt: -1 });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new equipment
router.post('/add', async (req, res) => {
  const equipment = new Equipment(req.body);
  try {
    const newEquipment = await equipment.save();
    res.status(201).json(newEquipment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update equipment status/details
router.put('/update/:id', async (req, res) => {
  try {
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedEquipment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete equipment
router.delete('/:id', async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Equipment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
