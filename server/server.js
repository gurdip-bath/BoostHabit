const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');  // Import authentication routes
require('dotenv').config();  // Optional: for environment variables

const app = express();

// Middleware
app.use(cors());  // Enables cross-origin requests
app.use(express.json());  // Parses incoming JSON request bodies

// Route middleware
app.use('/auth', authRoutes);  // Any route starting with /auth goes to auth.js

// Test route to ensure server is working
app.get('/', (req, res) => {
  res.send('Hello from the BoostHabit server!');
});

// Set the port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
