/**
 * ============================================================================
 *  Authentication Routes
 * ============================================================================
 * Purpose:
 *   - Handles User Registration (Signup) and Login
 *   - Uses bcrypt for password hashing
 *   - Uses JWT for authentication
 *
 * Endpoints:
 *   POST /auth/register → Register a new user
 *   POST /auth/login    → Login and get JWT token
 *
 * Database Table:
 *   Table Name: public."users"
 *   Columns: id, name, email, password, created_at
 *
 * ============================================================================
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/migrations/db');
const router = express.Router();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic Validation
  if (!name || !email || !password) {return res.status(400).json({
      success: false,
      error: 'Please provide name, email, and password'
    });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM public."users" WHERE email = $1',[email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert into DB
    const newUser = await pool.query(
      'INSERT INTO public."users" (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, hashedPassword]
    );
    // Create JWT token
    const token = jwt.sign({ id: newUser.rows[0].id, email: newUser.rows[0].email },JWT_SECRET, { expiresIn: '1h'});
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error('Error in /auth/register:', err);
    res.status(500).json({
      success: false,
      error: 'Something went wrong'
    });
  }
});

/**
 * @route   POST /auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide email and password'
    });
  }

  try {
    // Check if user exists
    const userResult = await pool.query(
      'SELECT * FROM public."users" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({success: true, message: 'Login successful',token,
      user: {id: user.id,name: user.name,email: user.email,created_at: user.created_at}});
  } catch (err) {
    console.error('Error in /auth/login:', err);
    res.status(500).json({
      success: false,
      error: 'Something went wrong'
    });
  }
});

module.exports = router;
