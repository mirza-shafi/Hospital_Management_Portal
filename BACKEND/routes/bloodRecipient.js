const express = require('express');
const router = express.Router();
const BloodRecipient = require('../models/BloodRecipient');
const BloodAvailability = require('../models/BloodAvailability');

// Route to handle blood recipient form submission
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, gender, email, phoneNumber, bloodNeeded, totalBagsNeeded } = req.body;

    // Check if enough blood is available
    const availability = await BloodAvailability.findOne({ bloodGroup: bloodNeeded });

    if (!availability) {
      return res.status(404).json({ message: 'Blood group not found.' });
    }

    if (availability.count < totalBagsNeeded) {
      return res.status(400).json({ message: 'Not enough blood available.' });
    }

    // Save recipient details
    const newRecipient = new BloodRecipient({
      firstName,
      lastName,
      gender,
      email,
      phoneNumber,
      bloodNeeded,
      totalBagsNeeded
    });

    await newRecipient.save();

    // Update blood availability
    availability.count -= totalBagsNeeded;
    await availability.save();

    res.status(200).json({ message: 'Request successfully submitted!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again.' });
  }
});

// GET request to fetch all blood requests
router.get('/', async (req, res) => {
  try {
      const requests = await BloodRecipient.find().sort({ createdAt: -1 });
      res.status(200).json(requests);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching blood requests', error });
  }
});
module.exports = router;
