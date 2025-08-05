/**
 * ============================================================================
 *  Data Routes
 * ============================================================================
 * Purpose:
 *   - Provide publicly accessible data for the frontend
 *   - Fetch dishes and offers from the database
 *
 * Endpoints:
 *   GET /api/dishes → Retrieve all available dishes
 *   GET /api/offers → Retrieve all current offers
 *
 * Database Tables:
 *   Table Name: public."dishes"
 *   Columns: id, name, description, price, originalPrice, category, rating,
 *            prepTime, isVeg, isPopular, image, created_at
 *
 *   Table Name: public."offers"
 *   Columns: id, title, description, discount, start_date, end_date, image, created_at
 *
 * ============================================================================
 */

const express = require('express');
const pool = require('../db/migrations/db'); // PostgreSQL connection pool
const router = express.Router();

/**
 * ============================================================================
 *  GET - Fetch All Dishes
 * ============================================================================
 * @route   GET /api/dishes
 * @desc    Retrieve all available dishes from the database
 * @access  Public
 *
 * @returns {Object[]} List of dishes
 *
 * Example Response:
 * [
 *   {
 *     "id": 1,
 *     "name": "Cheese Burst Pizza",
 *     "description": "Pizza with a cheesy crust, loaded with mozzarella and herbs",
 *     "price": 299,
 *     "originalprice": 399,
 *     "category": "pizza",
 *     "rating": 4.5,
 *     "prepTime": "25 min",
 *     "isVeg": true,
 *     "isPopular": true,
 *     "image": "pizza.jpg",
 *     "created_at": "2025-08-05T10:30:00.000Z"
 *   }
 * ]
 */
router.get('/dishes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM dishes ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      dishes: result.rows
    });
  } catch (err) {
    console.error('Error fetching dishes:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dishes'
    });
  }
});
/**
 * ============================================================================
 *  GET - Fetch Current Offers
 * ============================================================================
 * @route   GET /api/offers
 * @desc    Retrieve all current offers from the database
 * @access  Public
 *
 * @returns {Object[]} List of offers
 *
 * Example Response:
 * [
 *   {
 *     "id": 1,
 *     "title": "Summer Special",
 *     "description": "Get 20% off on all pizzas",
 *     "discount": 20,
 *     "start_date": "2025-08-01",
 *     "end_date": "2025-08-15",
 *     "image": "offer.jpg",
 *     "created_at": "2025-08-05T10:30:00.000Z"
 *   }
 * ]
 */
router.get('/dishes/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM dishes WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Dish not found' });
  res.json(result.rows[0]); // Return single object
});
/**
 * ============================================================================
 *  GET - Fetch Current Offers
 * ============================================================================
 * @route   GET /api/offers
 * @desc    Retrieve all current offers from the database
 * @access  Public
 *
 * @returns {Object[]} List of offers
 *
 * Example Response:
 * [
 *   {
 *     "id": 1,
 *     "title": "Summer Special",
 *     "description": "Get 20% off on all pizzas",
 *     "discount": 20,
 *     "start_date": "2025-08-01",
 *     "end_date": "2025-08-15",
 *     "image": "offer.jpg",
 *     "created_at": "2025-08-05T10:30:00.000Z"
 *   }
 * ]
 */
router.get('/offers', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM offers ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      offers: result.rows
    });
  } catch (err) {
    console.error('Error fetching offers:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch offers'
    });
  }
});

module.exports = router;
