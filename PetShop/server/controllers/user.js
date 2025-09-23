import User from "../models/user.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

let otpStore = {};
let otpRequestLog = {}; // Tracks OTP requests per email
let otpAttemptLog = {}; // Tracks failed attempts per email

const MAX_OTP_REQUESTS_PER_HOUR = 3;
const MAX_OTP_ATTEMPTS = 5;

export const updateInfor = async (req, res) => {
  try {
    const { user_id } = req.params;
    const updates = { ...req.body };

    const forbiddenFields = [
      "_id",
      "username",
      "password",
      "createdAt",
      "updatedAt",
      "isVerified",
    ];
    forbiddenFields.forEach((field) => delete updates[field]);

    const uniqueFields = ["email", "phone"];
    for (const field of uniqueFields) {
      if (updates[field]) {
        const exists = await User.findOne({
          [field]: updates[field],
          _id: { $ne: user_id },
        });
        if (exists) {
          return res
            .status(400)
            .json({ message: `${field} is already in use` });
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(user_id, updates, {
      new: true,
      runValidators: true,
    }).populate("role");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json(updatedUser, { message: "User information updated successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const updateAvatar = async (req, res) => {
  const { user_id } = req.params;
  const avatar = req.body.avatar
  try {
    const updatedUser = await User.findByIdAndUpdate(user_id, avatar,
    {
      new: true,
      runValidators: true,
    })
  } catch (error) {
    return res.status(500).json({message: "Sever error! Please try again later"})
  }
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SECRET,
    pass: process.env.EMAIL_PASS,
  },
});

const verifyOTP = (email, otp) => {
  const entry = otpStore[email];
  if (!entry) return { success: false, message: "No OTP found" };

  if (Date.now() > entry.expiresAt) {
    delete otpStore[email];
    return { success: false, message: "OTP expired" };
  }

  if (parseInt(otp) === entry.code) {
    delete otpStore[email];
    delete otpAttemptLog[email]; // reset failed attempts on success
    return { success: true };
  }

  // Track failed attempts
  if (!otpAttemptLog[email]) {
    otpAttemptLog[email] = { attempts: 1, lastAttemptAt: Date.now() };
  } else {
    otpAttemptLog[email].attempts += 1;
    otpAttemptLog[email].lastAttemptAt = Date.now();
  }

  if (otpAttemptLog[email].attempts > MAX_OTP_ATTEMPTS) {
    return {
      success: false,
      message: "Too many incorrect attempts. Try again in ten minutes.",
    };
  }

  return { success: false, message: "Invalid OTP." };
};

export const generateOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Invalid Email." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Rate limiting
    const now = Date.now();
    otpRequestLog[email] = otpRequestLog[email] || [];
    otpRequestLog[email] = otpRequestLog[email].filter(
      (t) => now - t < 60 * 60 * 1000
    );

    if (otpRequestLog[email].length >= MAX_OTP_REQUESTS_PER_HOUR) {
      return res.status(429).json({
        message: "OTP request limit exceeded. Try again in ten minutes.",
      });
    }

    otpRequestLog[email].push(now);

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes

    otpStore[email] = { code: otpCode, expiresAt };

    const mailOptions = {
      from: process.env.EMAIL_SECRET,
      to: email,
      subject: "Reset Password OTP",
      text: `Your OTP code is ${otpCode}. It will expire in 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, _info) => {
      if (error) {
        return res.status(500).send({ message: "Failed to send OTP." });
      }
      res.status(200).send({ message: "OTP sent successfully." });
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, OTP, and new password are required" });
    }

    const otpResult = verifyOTP(email, otp);
    if (!otpResult.success) {
      return res.status(401).json({ message: otpResult.message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// 🔁 Auto Cleanup Memory Logs Every 10 Minutes
setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  for (const email in otpStore) {
    if (otpStore[email].expiresAt < now) {
      delete otpStore[email];
    }
  }

  for (const email in otpRequestLog) {
    otpRequestLog[email] = otpRequestLog[email].filter((ts) => ts > oneHourAgo);
    if (otpRequestLog[email].length === 0) {
      delete otpRequestLog[email];
    }
  }

  for (const email in otpAttemptLog) {
    if (otpAttemptLog[email].lastAttemptAt < oneHourAgo) {
      delete otpAttemptLog[email];
    }
  }

  console.log(
    "[CLEANUP] Expired OTPs and logs removed:",
    new Date().toLocaleTimeString()
  );
}, 10 * 60 * 1000); // Run every 10 minutes
