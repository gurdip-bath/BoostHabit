const { Pool } = require('pg');

// Set up a connection pool for PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',        // Your PostgreSQL username
  host: process.env.DB_HOST || 'localhost',       // Database host
  database: process.env.DB_DATABASE || 'boosthabit_db', // Database name
  password: process.env.DB_PASSWORD || 'admin', // Database password
  port: process.env.DB_PORT || 5432,              // PostgreSQL port
});

// Error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.connect((err, _, release) => {
  if (err) {
    return console.error('Error connecting to database:', err.stack);
  }
  console.log('Connected to the database');
  release(); // Releases the client after connecting
});

module.exports = pool;  // Export the pool for use in other files

