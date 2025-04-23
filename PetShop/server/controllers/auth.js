import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import dotenv from "dotenv";
import Role from "../models/role.js";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const { username, password, name, email, phone, address, avatar } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const role = await Role.findOne({ name: "User" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to MongoDB
    const newUser = await User.create({
      username,
      password: hashedPassword,
      name,
      email,
      phone,
      address,
      avatar,
      role,
    });
    // console.log(newUser);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login User
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).populate("role");
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ id: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // Generate refresh token
    const refreshToken = jwt.sign({ id: user._id }, SECRET_KEY, {
      expiresIn: "7d",
    });

    res.json({
      user: {
        _id: user._id,
        role: user.role,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        phone: user.phone,
        address: user.address,
        tokenInfo: {
          accessToken: accessToken,
          expiresIn: 3600,
          refreshToken: refreshToken,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Protected Route Example
export const protectedRoute = (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
};
