// routes/addressRoutes.js
const express = require('express');
const pool = require('../db/migrations/db');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/addresses/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  try {
    const result = await pool.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json({ success: true, addresses: result.rows });
  } catch (err) {
    console.error('Error fetching addresses:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch addresses' });
  }
});
router.post('/addresses', authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  const { label, address } = req.body;

  if (!label || !address) {
    return res.status(400).json({ success: false, error: 'Label and address are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO addresses (user_id, label, address) VALUES ($1, $2, $3) RETURNING *',
      [user_id, label, address]
    );
    res.json({ success: true, address: result.rows[0] });
  } catch (err) {
    console.error('Error adding address:', err);
    res.status(500).json({ success: false, error: 'Failed to add address' });
  }
});

module.exports = router;