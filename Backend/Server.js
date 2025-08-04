

const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

// -----------------------------------------------------------------------------
// ROUTE IMPORTS
// -----------------------------------------------------------------------------
const authRoutes = require("./routes/authRoutes");          // Authentication
const dataRoutes = require("./routes/dataRoutes");          // Menu & offers
const orderRoutes = require("./controllers/order");         // Cart & orders
const testingRoutes = require("./test/test");               // Test endpoints
const profileRoutes = require("./routes/ProfileRoutes");    // User profile
const addressRoutes = require("./controllers/address");     // Addresses

// -----------------------------------------------------------------------------
// APP INITIALIZATION
// -----------------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------------------------------------------------------
// MIDDLEWARES
// -----------------------------------------------------------------------------
app.use(cors({
  origin: ['https://resilient-salamander-295126.netlify.app', 'http://localhost:5173'], // Allow only your frontend
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],              // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],        // Allow auth headers
  credentials: true                                         // Allow cookies/auth info
}));          
app.use(express.json());    // Parse incoming JSON payloads

// -----------------------------------------------------------------------------
// ROOT HEALTH CHECK ENDPOINT
// -----------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Food Ordering API is running...");
});

// -----------------------------------------------------------------------------
// TEST ROUTES
// -----------------------------------------------------------------------------
app.use("/test", testingRoutes);

// -----------------------------------------------------------------------------
// AUTHENTICATION ROUTES
// -----------------------------------------------------------------------------
/**
 * Prefix: /auth
 * Endpoints:
 *   POST /auth/register → Register a new user
 *   POST /auth/login    → Login and return JWT token
 */
app.use("/auth", authRoutes);

// -----------------------------------------------------------------------------
// FOOD MENU & OFFERS ROUTES
// -----------------------------------------------------------------------------
/**
 * Prefix: /api
 * Endpoints:
 *   GET /api/dishes → Retrieve all dishes
 *   GET /api/offers → Retrieve current offers
 */
app.use("/api", dataRoutes);

// -----------------------------------------------------------------------------
// PROFILE ROUTES
// -----------------------------------------------------------------------------
/**
 * Prefix: /api/profile
 * Endpoints:
 *   GET /api/profile       → Retrieve logged-in user profile
 */
app.use("/api", profileRoutes);

// -----------------------------------------------------------------------------
// CART & ORDER ROUTES
// -----------------------------------------------------------------------------
/**
 * Prefix: /api
 * Endpoints:
 *   GET /api/cart/:userId         → Get cart items
 *   POST /api/cart                → Add item to cart
 *   PUT /api/cart/:id             → Update cart item
 *   DELETE /api/cart/:id          → Remove cart item
 *   POST /api/cart/orders         → Place order
 *   GET /api/cart/orders/:userId  → Get order history
 */
app.use("/", orderRoutes);

// -----------------------------------------------------------------------------
// ADDRESS ROUTES
// -----------------------------------------------------------------------------
/**
 * Prefix: /api/addresses
 * Endpoints:
 *   GET /api/addresses/:userId → Get all user addresses
 *   POST /api/addresses        → Add new address
 */
app.use("/api", addressRoutes);

// -----------------------------------------------------------------------------
// START SERVER
// -----------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Food Ordering API running at: http://localhost:${PORT}`);
});
