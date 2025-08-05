const { Pool } = require('pg');

const pool = new Pool({
  user: 'foodorder_9136_user',
  host: 'dpg-d27pj26uk2gs73egle7g-a.singapore-postgres.render.com',
  database: 'foodorder_9136',
  password: 'n3Bb8iv6v2paJgfcbdI6X9IsymwgqYWo',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  },
  // Extra options to prevent ECONNRESET
  max: 10, // Max simultaneous connections
   // 30s idle timeout
  idleTimeoutMillis: 30000,
   // 10s connection timeout
  connectionTimeoutMillis: 10000
});

// Optional: Test connection once on startup
(async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL');
    client.release(); // release back to pool
  } catch (err) {
    console.error('PostgreSQL connection error:', err.message);
  }
})();

module.exports = pool;
