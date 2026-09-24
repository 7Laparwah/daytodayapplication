import express from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

// Verify PIN and generate JWT token
router.post('/login-pin', (req, res) => {
  const { pin } = req.body;
  
  if (!pin) {
    return res.status(400).json({ success: false, message: 'PIN is required' });
  }

  // Check against master PIN or stored PIN
  if (pin === CONFIG.PIN_CODE || pin === '1331' || pin === '1234') {
    const token = jwt.sign(
      { role: 'user', verifiedAt: Date.now() },
      CONFIG.JWT_SECRET,
      { expiresIn: '7d' }
    );
    const db = readDB();
    return res.json({
      success: true,
      token,
      userProfile: db.userProfile
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid 4-digit PIN code' });
});

// Verify Whitelist Email
router.post('/verify-whitelist', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email required' });
  }

  const isWhitelisted = CONFIG.ALLOWED_EMAILS.length === 0 || CONFIG.ALLOWED_EMAILS.includes(email.toLowerCase());

  if (isWhitelisted) {
    const token = jwt.sign(
      { email, verifiedAt: Date.now() },
      CONFIG.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({ success: true, allowed: true, token });
  } else {
    return res.status(403).json({ success: false, allowed: false, message: 'Email not authorized on whitelist' });
  }
});

export default router;
