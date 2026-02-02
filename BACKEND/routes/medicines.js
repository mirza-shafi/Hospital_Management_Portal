const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Medicine = require('../models/Medicine');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/medicines/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Add new medicine
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, genericName, dosageForm, strength, price, strip, manufacturer, description } = req.body;
    const image = req.file ? `/uploads/medicines/${req.file.filename}` : '';

    const newMedicine = new Medicine({
      name,
      genericName,
      dosageForm,
      strength,
      price,
      strip,
      manufacturer,
      description,
      image,
    });

    await newMedicine.save();
    res.status(201).json({ message: 'Medicine added to the list successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add medicine.', error: err.message });
  }
});

// Fetch all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({
      message: 'Error fetching medicines',
      error: error.message
    });
  }
});

// Update medicine stock
router.put('/:id', async (req, res) => {
  const { strip } = req.body;
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    medicine.strip = strip;
    await medicine.save();
    res.status(200).json({ message: 'Medicine stock updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update medicine stock', error: error.message });
  }
});
// Update medicine stock (increase or decrease)
router.put('/:id', async (req, res) => {
  const { operation, strip } = req.body;
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (operation === 'increase') {
      medicine.strip += strip;
    } else if (operation === 'decrease') {
      medicine.strip -= strip;
      if (medicine.strip < 0) {
        medicine.strip = 0; // Ensure strip count doesn't go negative
      }
    }

    await medicine.save();
    res.status(200).json({ message: 'Medicine stock updated successfully', updatedMedicine: medicine });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update medicine stock', error: error.message });
  }
});

module.exports = router;
