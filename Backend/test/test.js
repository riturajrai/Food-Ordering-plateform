// test/test.js
const express = require('express');
const pool = require('../db/migrations/db');
const router = express.Router();

/**
 * @route   GET /test
 * @desc    Basic test endpoint
 * @access  Public
 */
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Test endpoint working' });
});

/**
 * @route   GET /db-test
 * @desc    Test database connection
 * @access  Public
 */
router.get('/db-test', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ success: true, message: 'Database connection successful' });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ success: false, error: 'Database connection failed' });
  }
});

module.exports = router;