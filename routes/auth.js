const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const pool = require('../server/db');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const router = express.Router();

// Route for user registration

router.post('/register', 
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }).withMessage('Password must be at least 6 characters long and include lowercase, uppercase, numbers, and symbols')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [email, hashedPassword]
      );

      res.status(201).json({ msg: 'User registered successfully', user: newUser.rows[0] });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get('/test', (req, res) => {
  res.send('Auth route works!');
});


// Route for user login
router.post('/login', [
  // Step 1: Validate input fields
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Step 2: Generate JWT if credentials are correct
    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1h' }
    );

    res.json({ token, msg: 'Login successful' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Middleware to verify JWT and authenticate users
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const actualToken = token.split(' ')[1]; // Extracts the token part after 'Bearer'
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || 'your_jwt_secret_key');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Example of a protected route that requires authentication
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ msg: `Hello User ${req.userId}, you are authorized!` });
});

// Optional: Route for password reset initiation (generates reset token)
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ msg: 'Email not registered' });
    }

    // Generate reset token with a short expiration time (e.g., 15 minutes)
    const resetToken = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '15m' }
    );

    // Construct reset link URL to be sent to the user's email
    const resetLink = `https://yourapp.com/reset-password/${resetToken}`; // !! Adjust URL to match your app

    // Send reset email to the user using Nodemailer
    await transporter.sendMail({
      from: '"BoostHabit Support" <support@yourapp.com>', //!! change email to match real life email
      to: email,
      subject: 'Password Reset Request',
      text: `Please click the following link to reset your password: ${resetLink}`,
      html: `<p>Please click the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    // Send a response confirming that the email was sent
    res.json({ msg: 'Reset email sent successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// Route for password reset completion (resets password)
router.post('/reset-password/:token', [
  // Password validation middleware
  body('newPassword').isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  }).withMessage('Password must be at least 6 characters long and include lowercase, uppercase, numbers, and symbols')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, decoded.userId]);

    res.status(200).json({ msg: 'Password successfully reset' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or any other email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});




module.exports = router;


