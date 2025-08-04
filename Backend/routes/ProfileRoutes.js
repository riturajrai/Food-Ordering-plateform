const express = require("express");
const pool = require("../db/migrations/db"); // PostgreSQL connection
const authMiddleware = require("../middleware/authMiddleware"); // JWT verification middleware
const router = express.Router();

/**
 * @route   GET /profile
 * @desc    Get logged-in user profile
 * @access  Private (JWT Required)
 */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // req.user.id JWT से आता है (authMiddleware में सेट किया गया)
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM public."users" WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({success: true,profile: result.rows[0],});
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
