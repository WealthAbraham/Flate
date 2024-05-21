const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { dbconnect } = require('./config/db.config'); // Import your MongoDB connection function

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // To serve static files like CSS
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await dbconnect();
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
}

connectToMongoDB();

// User schema and model
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  password: String,
  address: String
});
const User = mongoose.model('User', userSchema);

// Display sign up form
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Handle sign up form submission
app.post('/signup', async (req, res) => {
  // Implement signup logic here
});

// Display login form
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login form submission
app.post('/login', async (req, res) => {
  // Implement login logic here
});

// Middleware to check if user is logged in
function checkAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Protected route example
app.get('/dashboard', checkAuth, (req, res) => {
  res.send('Welcome to your dashboard');
});

// Handle request to fetch user's address
app.get('/user/address', checkAuth, async (req, res) => {
  // Implement logic to fetch user's address here
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app;
