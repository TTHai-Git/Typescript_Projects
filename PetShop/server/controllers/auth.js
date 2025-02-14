const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');

const SECRET_KEY = process.env.JWT_SECRET;

const register = async (req, res) => {
  const {username, password, name, email, phone, address, avatar } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to MongoDB
    const newUser = new User({username, password: hashedPassword, name, email, phone, address, avatar });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login User
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    // Generate refresh token
    const refreshToken = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '7d' });

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        phone: user.phone,
        address: user.address,
        accessTokenInfo: {
          accessToken: token,
          expiresIn: 3600,
          refreshToken: refreshToken
        },
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Protected Route Example
const protectedRoute = (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
};

module.exports = {
  register,
  login,
  protectedRoute,
};
