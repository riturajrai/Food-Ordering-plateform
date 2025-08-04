// routes/dataRoutes.js
const express = require('express');
const pool = require('../db/migrations/db');
const router = express.Router();

/**
 * @route   GET /api/dishes
 * @desc    Retrieve all available dishes
 * @access  Public
 */
router.get('/dishes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dishes ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching dishes:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch dishes' });
  }
});

/**
 * @route   GET /api/offers
 * @desc    Retrieve current offers
 * @access  Public
 */
router.get('/offers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM offers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching offers:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch offers' });
  }
});

module.exports = router;