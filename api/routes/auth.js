const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already registered.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      fname,
      lname,
      email,
      password: hashedPassword,
      // First user gets admin, otherwise user
      role: (await User.countDocuments()) === 0 ? 'admin' : 'user'
    });

    await user.save();

    const token = jwt.sign({ _id: user._id, role: user.role, name: user.fname }, process.env.JWT_SECRET || 'fallback_secret');
    res.header('Authorization', 'Bearer ' + token).json({ token, user: { _id: user._id, fname, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ _id: user._id, role: user.role, name: user.fname }, process.env.JWT_SECRET || 'fallback_secret');
    res.json({ token, user: { _id: user._id, fname: user.fname, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Current User
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
