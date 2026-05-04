import express from 'express';
import Subscriber from '../models/Subscriber.js';

const router = express.Router();

// POST /api/subscribe
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const exists = await Subscriber.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Already subscribed!' });

    await Subscriber.create({ email });
    res.json({ success: true, message: 'Subscribed successfully! 🎉' });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Already subscribed!' });
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
