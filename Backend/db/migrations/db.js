const { Pool } = require('pg');

const pool = new Pool({
  user: 'foodorder_9136_user',
  host: 'dpg-d27pj26uk2gs73egle7g-a.singapore-postgres.render.com',
  database: 'foodorder_9136',
  password: 'n3Bb8iv6v2paJgfcbdI6X9IsymwgqYWo',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQl'))
  .catch(err => console.error('Connection error', err));

module.exports = pool;
