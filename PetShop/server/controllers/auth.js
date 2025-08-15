import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import dotenv from "dotenv";
import Role from "../models/role.js";
import nodemailer from "nodemailer";
import validator from "validator";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const { username, password, name, email, phone, address, avatar } = req.body;

  const isValidEmail = validator.isEmail(email); // returns true or false
  // console.log(isValidEmail);
  if (!isValidEmail) {
    return res.status(400).json({ message: "Invalid email format" });
  }

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

    const emailToken = jwt.sign({ id: newUser._id }, process.env.EMAIL_SECRET, {
      expiresIn: "1d",
    });

    const url = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SECRET,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      to: email,
      subject: "Verify Your Email Of Account On E-Commerce Website DOGSHOP",
      html: `Click <a href="${url}">here</a> to verify your email. Expires in 24 hourse.`,
    });

    return res.status(201).json({
      message:
        "User registered successfully. Verification email has sent to your email. Please check your email to verify acount as soon as !",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login User
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user =
      (await User.findOne({ username }).populate("role")) ||
      (await User.findOne({ email: username }).populate("role")) ||
      (await User.findOne({ phone: username }).populate("role"));
    if (!user) {
      const user = await User.findOne({ username }).populate("role");
      return res.status(400).json({ message: "Invalid Username/EmaiL/Phone" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create JWT tokens
    const accessToken = jwt.sign({ id: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ id: user._id }, SECRET_KEY, {
      expiresIn: "7d",
    });

    // ✅ Set HttpOnly Cookie
    if (process.env.NODE_ENV === "production"){
        res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // use HTTPS in prod
        sameSite: "None",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      // ✅ Optionally: Set refresh token in cookie too
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }
    else {
        res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development", // use HTTPS in prod
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      // ✅ Optionally: Set refresh token in cookie too
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

    }
    // ✅ Only return user data (no token)
    res.status(200).json({
      user: {
        _id: user._id,
        role: user.role,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const logout = (req, res) => {
  if (process.env.NODE_ENV === "production") {
      res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
  }
  else {
      res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "Strict",
    });
  }
  
  res.status(200).json({ message: "Logged out" });
};

export const authMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("role")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Protected Route Example
export const protectedRoute = (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
};

export const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ message: "Access token refreshed" });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};
