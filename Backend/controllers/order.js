const express = require('express');
const pool = require('../db/migrations/db');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

/**
 * ============================================================================
 *  GET - Fetch all cart items for a specific user
 * ============================================================================
 * @route   GET /api/cart/:userId
 * @desc    Retrieve all items in the authenticated user's cart
 * @access  Private
 */
router.get('/api/cart/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;

  if (req.user.id !== parseInt(userId, 10)) {
    console.error(`Unauthorized access: user ${req.user.id} tried to access cart for user ${userId}`);
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const result = await pool.query(
      `SELECT id, product_id, product_name AS name, image, is_veg, price, quantity 
       FROM cart 
       WHERE user_id = $1`,
      [userId]
    );
    res.json({ success: true, cart: result.rows });
  } catch (err) {
    console.error('Error fetching cart:', err.message, err.stack);
    if (err.code === '42P01') {
      return res.status(500).json({ success: false, error: 'Cart table does not exist' });
    }
    res.status(500).json({ success: false, error: 'Failed to fetch cart' });
  }
});

/**
 * ============================================================================
 *  POST - Add item to cart (or update quantity if already exists)
 * ============================================================================
 * @route   POST /api/cart
 * @desc    Add a product to the authenticated user's cart
 * @access  Private
 */
router.post('/api/cart', authMiddleware, async (req, res) => {
  const { user_id, product_id, product_name, image, is_veg, price, quantity } = req.body;

  if (req.user.id !== user_id) {
    console.error(`Unauthorized access: user ${req.user.id} tried to add to cart for user ${user_id}`);
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  if (!product_id || !product_name || !price || !quantity || quantity <= 0) {
    console.error('Invalid input data:', req.body);
    return res.status(400).json({ success: false, error: 'Invalid input data' });
  }

  try {
    const existingItem = await pool.query(
      `SELECT id, quantity 
       FROM cart 
       WHERE user_id = $1 AND product_id = $2`,
      [user_id, product_id]
    );

    if (existingItem.rows.length > 0) {
      const newQuantity = existingItem.rows[0].quantity + quantity;
      if (newQuantity <= 0) {
        console.error(`Invalid quantity update: newQuantity=${newQuantity} for cart item ${existingItem.rows[0].id}`);
        return res.status(400).json({ success: false, error: 'Quantity cannot be less than or equal to zero' });
      }
      const result = await pool.query(
        `UPDATE cart 
         SET quantity = $1 
         WHERE id = $2 
         RETURNING id, product_id, product_name AS name, image, is_veg, price, quantity`,
        [newQuantity, existingItem.rows[0].id]
      );
      return res.json({ success: true, item: result.rows[0] });
    }

    const result = await pool.query(
      `INSERT INTO cart (user_id, product_id, product_name, image, is_veg, price, quantity) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, product_id, product_name AS name, image, is_veg, price, quantity`,
      [user_id, product_id, product_name, image, is_veg, price, quantity]
    );
    res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error('Error adding to cart:', err.message, err.stack);
    if (err.code === '42P01') {
      return res.status(500).json({ success: false, error: 'Cart table does not exist' });
    }
    res.status(500).json({ success: false, error: 'Failed to add to cart' });
  }
});

/**
 * ============================================================================
 *  PUT - Update quantity of a cart item
 * ============================================================================
 * @route   PUT /api/cart/:id
 * @desc    Update quantity for a specific cart item
 * @access  Private
 */
router.put('/api/cart/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
    console.error(`Invalid quantity: ${quantity} for cart item ${id}`);
    return res.status(400).json({ success: false, error: 'Quantity must be a positive integer' });
  }

  try {
    const checkItem = await pool.query(
      `SELECT user_id FROM cart WHERE id = $1`,
      [id]
    );

    if (checkItem.rows.length === 0) {
      console.error(`Cart item ${id} not found`);
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    if (checkItem.rows[0].user_id !== req.user.id) {
      console.error(`Unauthorized: user ${req.user.id} tried to update cart item ${id}`);
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const result = await pool.query(
      `UPDATE cart 
       SET quantity = $1 
       WHERE id = $2 
       RETURNING id, product_id, product_name AS name, image, is_veg, price, quantity`,
      [quantity, id]
    );

    if (result.rows.length === 0) {
      console.error(`Failed to update cart item ${id}`);
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error('Error updating cart:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Failed to update cart' });
  }
});

/**
 * ============================================================================
 *  DELETE - Remove single item from cart
 * ============================================================================
 * @route   DELETE /api/cart/:id
 * @desc    Delete a specific item from the authenticated user's cart
 * @access  Private
 */
router.delete('/api/cart/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const checkItem = await pool.query(
      `SELECT user_id FROM cart WHERE id = $1`,
      [id]
    );

    if (checkItem.rows.length === 0) {
      console.error(`Cart item ${id} not found`);
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    if (checkItem.rows[0].user_id !== req.user.id) {
      console.error(`Unauthorized: user ${req.user.id} tried to delete cart item ${id}`);
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const result = await pool.query(
      `DELETE FROM cart 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting from cart:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Failed to delete from cart' });
  }
});

/**
 * ============================================================================
 *  DELETE - Clear all items from cart
 * ============================================================================
 * @route   DELETE /api/cart/all/:userId
 * @desc    Remove all items from a user's cart
 * @access  Private
 */
router.delete('/api/cart/all/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;

  if (req.user.id !== parseInt(userId, 10)) {
    console.error(`Unauthorized: user ${req.user.id} tried to clear cart for user ${userId}`);
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  try {
    await pool.query(`DELETE FROM cart WHERE user_id = $1`, [userId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error clearing cart:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Failed to clear cart' });
  }
});

/**
 * ============================================================================
 *  POST - Place an order
 * ============================================================================
 * @route   POST /api/cart/orders
 * @desc    Create a new order from cart items
 * @access  Private
 */
router.post('/api/cart/orders', authMiddleware, async (req, res) => {
  const { user_id, order_id, items, total, address } = req.body;

  if (req.user.id !== user_id) {
    console.error(`Unauthorized: user ${req.user.id} tried to place order for user ${user_id}`);
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  if (!order_id || !items || !total || !address) {
    console.error('Missing required fields:', req.body);
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, order_id, items, total, address, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [user_id, order_id, JSON.stringify(items), total, address, 'pending']
    );

    await pool.query(`DELETE FROM cart WHERE user_id = $1`, [user_id]);

    res.json({ success: true, order: orderResult.rows[0] });
  } catch (err) {
    console.error('Error placing order:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Failed to place order' });
  }
});

/**
 * ============================================================================
 *  GET - Fetch all orders for a specific user
 * ============================================================================
 * @route   GET /api/cart/orders/:userId
 * @desc    Retrieve all past orders for a user
 * @access  Private
 */
router.get('/api/cart/orders/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;

  if (req.user.id !== parseInt(userId, 10)) {
    console.error(`Unauthorized: user ${req.user.id} tried to fetch orders for user ${userId}`);
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const result = await pool.query(
      `SELECT id, order_id, items, total, address, status, created_at 
       FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ success: true, orders: result.rows });
  } catch (err) {
    console.error('Error fetching orders:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

/**
 * ============================================================================
 *  GET - Fetch single order details
 * ============================================================================
 * @route   GET /api/cart/orders/:userId/:orderId
 * @desc    Get detailed information for a specific order
 * @access  Private
 */
router.get('/api/cart/orders/:userId/:orderId', authMiddleware, async (req, res) => {
  const { userId, orderId } = req.params;

  if (req.user.id !== parseInt(userId, 10)) {
    console.error(`Unauthorized: user ${req.user.id} tried to fetch order ${orderId} for user ${userId}`);
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const result = await pool.query(
      `SELECT id, order_id, items, total, address, status, created_at 
       FROM orders 
       WHERE user_id = $1 AND order_id = $2`,
      [userId, orderId]
    );

    if (result.rows.length === 0) {
      console.error(`Order ${orderId} not found for user ${userId}`);
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, order: result.rows[0] });
  } catch (err) {
    console.error('Error fetching order:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
});

module.exports = router;
