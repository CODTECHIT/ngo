const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');

// Register for an event
router.post('/', auth, async (req, res) => {
  try {
    const { eventId } = req.body;
    // Check if already registered
    const existing = await Registration.findOne({ userId: req.user._id, eventId });
    if (existing) return res.status(400).json({ error: 'Already registered for this event.' });

    const registration = new Registration({ userId: req.user._id, eventId });
    await registration.save();
    res.json(registration);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get my registrations
router.get('/me', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id }).populate('eventId');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all registrations (Admin)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied.' });
  try {
    const registrations = await Registration.find().populate('userId', 'fname lname email').populate('eventId', 'title');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
