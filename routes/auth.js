const express = require('express');  // Import the Express framework to handle routing and HTTP requests
const bcrypt = require('bcryptjs');  // Import bcryptjs for hashing passwords securely
const { body, validationResult } = require('express-validator');  // Import validation functions from express-validator to validate input
const pool = require('../db');  // Import the PostgreSQL connection pool from the db file
const jwt = require('jsonwebtoken');  // Import jsonwebtoken for generating and verifying JWT tokens

const router = express.Router();  // Create a new Express router for defining authentication routes

// Route for user registration
router.post('/register', 
  [
    // Validate that the email is in a proper format
    body('email').isEmail().withMessage('Please enter a valid email'),
    // Enhance password validation with strength requirements
    body('password').isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }).withMessage('Password must be at least 6 characters long and include lowercase, uppercase, numbers, and symbols')
  ],
  async (req, res) => {
    // Extract validation errors from the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation fails, return 400 Bad Request with the validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure email and password from the request body
    const { email, password } = req.body;

    try {
      // Query the database to check if a user with the same email already exists
      const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userExists.rows.length > 0) {
        // If a user already exists, return a 400 status with an error message
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Generate a salt for hashing the password
      const salt = await bcrypt.genSalt(10);
      // Hash the user's password using the salt
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert the new user into the database with the email and hashed password
      const newUser = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [email, hashedPassword]
      );

      // Respond with a success message and the newly created user object
      res.status(201).json({ msg: 'User registered successfully', user: newUser.rows[0] });

    } catch (err) {
      // If there is any server error, log it and return a 500 Internal Server Error response
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Route for user login
router.post('/login', async (req, res) => {
  // Destructure email and password from the request body
  const { email, password } = req.body;

  try {
    // Query the database to find the user by email
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      // If no user is found, return a 400 status with an error message
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      // If the password does not match, return a 400 status with an error message
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Generate a JWT token containing the user's ID
    const token = jwt.sign(
      { userId: user.rows[0].id },  // Payload containing the user ID
      process.env.JWT_SECRET || 'your_jwt_secret_key',  // Secret key for signing the token (use an environment variable in production)
      { expiresIn: '1h' }  // The token will expire in 1 hour
    );

    // Return the generated JWT token to the client
    res.json({ token });

  } catch (err) {
    // If there is any server error, log it and return a 500 Internal Server Error response
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Middleware to verify JWT and authenticate users
const authenticateToken = (req, res, next) => {
  // Get the token from the request headers (Authorization)
  const token = req.header('Authorization');

  // If no token is provided, return a 401 Unauthorized status
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    // Attach the decoded user ID to the request object for use in other routes
    req.userId = decoded.userId;
    // Call the next middleware function
    next();
  } catch (err) {
    // If token verification fails, return a 401 Unauthorized status
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Example of a protected route that requires authentication
router.get('/protected', authenticateToken, (req, res) => {
  // Respond with a message and the authenticated user's ID
  res.json({ msg: `Hello User ${req.userId}, you are authorized!` });
});

module.exports = router;  // Export the router to be used in other parts of the application (e.g., server.js)
