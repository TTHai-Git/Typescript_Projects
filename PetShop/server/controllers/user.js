import User from "../models/user.js";
import bcrypt from "bcryptjs";
import "../config/dotenv.config.js";
import { sendEmail } from "../config/gmail.config.js";
import redis from "../utils/redis.js";

const MAX_OTP_REQUESTS_PER_HOUR = 3;
const MAX_OTP_ATTEMPTS = 5;

const debugOTPState = async (email) => {
  const otp = await redis.get(`otp:${email}`);
  const attempts = await redis.get(`otp:attempt:${email}`);
  const reqCount = await redis.get(`otp:req:${email}`);

  console.log("🔍 DEBUG OTP STATE:", {
    email,
    otp,
    attempts,
    reqCount,
  });
};


const verifyOTP = async (email, otp) => {
  const storedOTP = await redis.get(`otp:${email}`);
  if (!storedOTP)
    return { success: false, message: "OTP expired or not found." };

  if (storedOTP === otp) return { success: true };

  const attempts = await redis.incr(`otp:attempt:${email}`);
  if (attempts === 1) {
    await redis.expire(`otp:attempt:${email}`, 10 * 60);
  }

  if (attempts > MAX_OTP_ATTEMPTS) {
    return {
      success: false,
      message: "Too many attempts. Try again in 10 minutes.",
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

    const requestCount = await redis.incr(`otp:req:${email}`);
    if (requestCount === 1) await redis.expire(`otp:req:${email}`, 60 * 60);
    if (requestCount > MAX_OTP_REQUESTS_PER_HOUR)
      return res.status(429).json({ message: "OTP limit exceeded." });

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    await redis.setex(`otp:${email}`, 5 * 60, otpCode);
    await redis.del(`otp:attempt:${email}`);

    try {
      await sendEmail(
        process.env.EMAIL_SECRET,
        email,
        "Reset Password OTP",
        `Your OTP is ${otpCode}. It expires in 5 minutes.`
      );

      return res.status(200).json({
        message: "OTP sent successfully."
      });

    } catch (error) {
      console.error("❌ Error sending OTP email:", error);

      return res.status(500).json({
        message: "Failed to send OTP email.",
        error: error.message, // (optional: xem log)
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, OTP, and new password are required" });
    }

    const otpResult = await verifyOTP(email, otp);
    
    await debugOTPState(email); // Log sau khi check OTP

    if (!otpResult.success) {
      return res.status(401).json({ message: otpResult.message });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({ message: "You cannot set the same password as the old one!" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await redis.del(`otp:${email}`);
    await redis.del(`otp:attempt:${email}`);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const handleEnable2FAInfoForUser = async (req, res) => {
  const { user_id } = req.params;
  const { secret } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    user_id,
    {
      isAuthenticated2Fa: true,
      secretKey2FA: secret,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (updatedUser)
    return res
      .status(200)
      .json({ message: "Two-Factor Authentication enabled successfully!" });
  return res
    .status(400)
    .json({ message: "Two-Factor Authentication enabled fail!" });
};

export const handleDisable2FAInfoForUser = async (req, res) => {
  const { user_id } = req.params;
  console.log();
  const updatedUser = await User.findByIdAndUpdate(
    user_id,
    {
      isAuthenticated2Fa: false,
      secretKey2FA: "",
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (updatedUser)
    return res
      .status(200)
      .json({ message: "Two-Factor Authentication disabled successfully!" });
  return res
    .status(400)
    .json({ message: "Two-Factor Authentication disabled fail!" });
};

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
  const avatar = req.body.avatar;
  // console.log("avatar", avatar)
  // console.log("user_id", user_id)
  try {
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        avatar: avatar,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    // console.log("updatedUser",updatedUser )
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Sever error! Please try again later" });
  }
};
