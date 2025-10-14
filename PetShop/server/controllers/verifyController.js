import jwt from "jsonwebtoken";
import User from "../models/user.js";
import "../config/dotenv.config.js"; // ✅ loads environment variables once

export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    const payload = jwt.verify(token, process.env.EMAIL_SECRET);
    await User.findByIdAndUpdate(payload.id, { isVerified: true });
    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
