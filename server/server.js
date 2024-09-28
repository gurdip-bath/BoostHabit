// Import required packages
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');  // For password hashing
const pool = require('./db');  // Assuming db.js handles your PostgreSQL connection
const { body, validationResult } = require('express-validator');

// Initialize Express
const app = express();

// Middleware
app.use(cors());  // Enables cross-origin requests
app.use(express.json());  // Allows parsing JSON request bodies

// Registration route with validation
app.post('/register', 
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if the user already exists
      const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save user to the database
      const newUser = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [email, hashedPassword]
      );

      res.json(newUser.rows[0]);  // Respond with the newly created user
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Test database connection route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(result.rows[0]);  // Sends the current time from PostgreSQL
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Test route to ensure server is working
app.get('/', (req, res) => {
  res.send('Hello from the BoostHabit server!');
});

// Set the port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
