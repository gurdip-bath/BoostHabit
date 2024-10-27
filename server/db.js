const { Pool } = require('pg');

// Set up a connection pool for PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',        // Your PostgreSQL username
  host: process.env.DB_HOST || 'localhost',       // Database host
  database: process.env.DB_DATABASE || 'boosthabit_db', // Database name
  password: process.env.DB_PASSWORD || 'admin', // Database password
  port: process.env.DB_PORT || 5432,              // PostgreSQL port
});

module.exports = pool;  // Export the pool for use in other files
