const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { dbconnect } = require('./config/db.config'); // Import your MongoDB connection function

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // To serve static files like CSS
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Connect to MongoDB using your MongoDB URI
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
  const { fullName, email, phoneNumber, password, address } = req.body;

  // Check if user with the provided email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // User with the provided email already exists
    res.status(400).json({ message: 'Username or Email already exists' });
  } else {
    // User with the provided email doesn't exist, proceed with signup
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, phoneNumber, password: hashedPassword, address });

    try {
      await user.save();
      res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
      console.error('Error while saving user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

// Display login form
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login form submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ email: username });
  
  // Logging for debugging
  console.log("Login attempt:", { username, password, user });
  
  if (user) {
    // Check if user.password and password are defined
    if (user.password && password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        req.session.userId = user._id;
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } else {
      console.error("Password or hash is missing");
      res.status(400).json({ message: 'Bad Request' });
    }
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
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
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);
        if (user) {
            res.json({ address: user.address });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user address:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
