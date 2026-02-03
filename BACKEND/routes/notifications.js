const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications for a patient
router.get('/:email', async (req, res) => {
  try {
    const notifications = await Notification.find({ patientEmail: req.params.email })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a notification (for system use/testing)
router.post('/', async (req, res) => {
  const { patientEmail, type, message, icon } = req.body;
  try {
    const newNotification = new Notification({
      patientEmail,
      type,
      message,
      icon
    });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mark as read
router.put('/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
