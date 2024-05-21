// app.js
const path = require('path');
const bcrypt = require('bcrypt');

const express = require("express");
const { dbconnect } = require("./config/db.config");
const cors = require('cors');
const User = require('./models/User');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.post("/user/signup", async (req, res) => {
  try {
    const { email, fullName, phoneNumber, password, address } = req.body;

    if (!password) {
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      fullName,
      phoneNumber,
      password: hashedPassword,
      address
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !password || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid email or password');
    }

    res.status(200).json({ message: 'Authentication successful' });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

const port = 4000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

dbconnect().then(() => {
  console.log("Database connection successful");
});
