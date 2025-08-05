const express = require('express');
const pool = require('../db/migrations/db');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/api/cart/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  try {
    const result = await pool.query(
      'SELECT id, product_id, product_name as name, image as image, is_veg, price, quantity FROM cart WHERE user_id = $1',
      [userId]
    );
    res.json({ success: true, cart: result.rows });
  } catch (err) {
    console.error('Error fetching cart:', err);
    if (err.code === '42P01') {
      return res.status(500).json({ success: false, error: 'Cart table does not exist' });
    }
    res.status(500).json({ success: false, error: 'Failed to fetch cart' });
  }
});

router.post('/api/cart', authMiddleware, async (req, res) => {
  const { user_id, product_id, product_name, image, is_veg, price, quantity } = req.body;
  if (req.user.id !== user_id) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  try {
    // Check if item already exists in cart
    const existingItem = await pool.query(
      'SELECT id, quantity FROM cart WHERE user_id = $1 AND product_id = $2',
      [user_id, product_id]
    );
    if (existingItem.rows.length > 0) {
      // Update quantity if item exists
      const newQuantity = existingItem.rows[0].quantity + quantity;
      const result = await pool.query(
        'UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING id, product_id, product_name as name, image, is_veg, price, quantity',
        [newQuantity, existingItem.rows[0].id]
      );
      return res.json({ success: true, item: result.rows[0] });
    }
    // Insert new item if it doesn't exist
    const result = await pool.query(
      'INSERT INTO cart (user_id, product_id, product_name, image, is_veg, price, quantity) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, product_id, product_name as name, image, is_veg, price, quantity',
      [user_id, product_id, product_name, image, is_veg, price, quantity]
    );
    res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error('Error adding to cart:', err);
    if (err.code === '42P01') {
      return res.status(500).json({ success: false, error: 'Cart table does not exist' });
    }
    res.status(500).json({ success: false, error: 'Failed to add to cart' });
  }
});

router.put('/api/cart/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const result = await pool.query(
      'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING id, product_id, product_name as name, image, is_veg, price, quantity',
      [quantity, id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found or unauthorized' });
    }
    res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error('Error updating cart:', err);
    if (err.code === '42P01') {
      return res.status(500).json({ success: false, error: 'Cart table does not exist' });
    }
    res.status(500).json({ success: false, error: 'Failed to update cart' });
  }
});

router.delete('/api/cart/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found or unauthorized' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting from cart:', err);
    if (err.code === '42P01') {
      return res.status(500).json({ success: false, error: 'Cart table does not exist' });
    }
    res.status(500).json({ success: false, error: 'Failed to delete from cart' });
  }
});

router.delete('/api/cart/all/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  try {
    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error clearing cart:', err);
    if (err.code === '42P01') {
      return res.status(500).json({ success: false, error: 'Cart table does not exist' });
    }
    res.status(500).json({ success: false, error: 'Failed to clear cart' });
  }
});

router.post('/api/cart/orders', authMiddleware, async (req, res) => {
  const { user_id, order_id, items, total, address } = req.body;
  if (req.user.id !== user_id) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  if (!order_id || !items || !total || !address) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  try {
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, order_id, items, total, address, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, order_id, JSON.stringify(items), total, address, 'pending']
    );
    try {
      await pool.query('DELETE FROM cart WHERE user_id = $1', [user_id]);
    } catch (err) {
      console.warn('Warning: Could not clear cart:', err.message);
    }
    res.json({ success: true, order: orderResult.rows[0] });
  } catch (err) {
    console.error('Error placing order:', err);
    if (err.code === '42P01') {
      return res.status(500).json({ success: false, error: 'Orders table does not exist' });
    }
    res.status(500).json({ success: false, error: 'Failed to place order' });
  }
});

router.get('/api/cart/orders/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  try {
    const result = await pool.query(
      'SELECT id, order_id, items, total, address, status, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json({ success: true, orders: result.rows });
  } catch (err) {
    console.error('Error fetching orders:', err);
    if (err.code === '42P01') {
      return res.status(500).json({ success: false, error: 'Orders table does not exist' });
    }
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

router.get('/api/cart/orders/:userId/:orderId', authMiddleware, async (req, res) => {
  const { userId, orderId } = req.params;
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  try {
    const result = await pool.query(
      'SELECT id, order_id, items, total, address, status, created_at FROM orders WHERE user_id = $1 AND order_id = $2',
      [userId, orderId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order: result.rows[0] });
  } catch (err) {
    console.error('Error fetching order:', err);
    if (err.code === '42P01') {
      return res.status(500).json({ success: false, error: 'Orders table does not exist' });
    }
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
});

module.exports = router;
