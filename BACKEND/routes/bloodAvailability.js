const express = require('express');
const router = express.Router();
const BloodAvailability = require('../models/BloodAvailability');

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

module.exports = router;
