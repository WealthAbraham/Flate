// models/User.js

const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
   // unique: true // Ensure email is unique
  },
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  // Additional fields can be added based on your application's requirements
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the User model based on the schema
module.exports = mongoose.model('User', userSchema);
