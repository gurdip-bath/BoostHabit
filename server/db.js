const { Pool } = require('pg');

// Use your PostgreSQL credentials
const pool = new Pool({
  user: 'postgres',        //  PostgreSQL username
  password: 'admin',       //  PostgreSQL password
  host: 'localhost',       //  PostgreSQL server (localhost in this case)
  port: 5432,              // The port PostgreSQL is running on (5432 is default)
  database: 'boosthabit'   // The name of  database (boosthabit or postgres)
});

module.exports = pool;
