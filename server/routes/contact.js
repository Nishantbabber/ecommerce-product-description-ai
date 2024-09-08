const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST request to submit feedback
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Save the feedback in the database
    const newFeedback = new Feedback({
      name,
      email,
      message
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
