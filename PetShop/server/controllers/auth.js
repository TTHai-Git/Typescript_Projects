import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Role from "../models/role.js";
import nodemailer from "nodemailer";
import validator from "validator";
import "../config/dotenv.config.js"; // ✅ loads environment variables once
import speakeasy from "speakeasy";

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
      return res.status(200).json({ message: "User has already exists" });
    }

    // Check If phone of user is exists
    const existingPhoneOfUser = await User.findOne({ phone });
    if (existingPhoneOfUser) {
      return res.status(200).json({ message: "This phone has already exists" });
    }

    // Check If email of user is exists
    const existingEmailOfUser = await User.findOne({ email });
    if (existingEmailOfUser) {
      return res.status(200).json({ message: "This email has already exists" });
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
      doc: newUser,
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

    if (!user)
      return res.status(400).json({ message: "Invalid Username/EmaiL/Phone" });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });

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

    // ✅ Set HttpOnly Cookies
    const isProd = process.env.REACT_APP_NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProd, // chỉ bật HTTPS khi production
      sameSite: isProd ? "None" : "Lax",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000, // 1h
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });

    if (!user?.isAuthenticated2Fa) {
      res.status(200).json(getFiledsOfUserWhenLogin(user));
    } else {
      return res.status(200).json({
        _id: user._id,
        isAuthenticated2Fa: user.isAuthenticated2Fa,
        secretKey2FA: user.secretKey2FA,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const handleLoginWith2Fa = async (req, res) => {
  const { totp, secretKey, userId } = req.body;
  // console.log("req.body", req.body);
  const isVerified2FA = speakeasy.totp.verify({
    secret: secretKey,
    encoding: "base32",
    token: totp,
  });
  if (isVerified2FA) {
    const user = await User.findById(userId).populate("role");
    return res.status(200).json({
      isVerified2FA: true,
      message: "Two-Factor Authentication successful!",
      user: getFiledsOfUserWhenLogin(user),
    });
  } else {
    return res.status(400).json({
      isVerified2FA: false,
      message: "Invalid or expired 2FA code!",
    });
  }
};

export const getFiledsOfUserWhenLogin = (user) => {
  return {
    _id: user._id,
    role: user.role,
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    email: user.email,
    phone: user.phone,
    address: user.address,
    isVerified: user.isVerified,
    isAuthenticated2Fa: user.isAuthenticated2Fa
      ? user.isAuthenticated2Fa
      : false,
  };
};

export const logout = (req, res) => {
  const isProd = process.env.REACT_APP_NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProd, // chỉ bật HTTPS khi production
    sameSite: isProd ? "None" : "Lax",
    path: "/", // thêm cái này để chắc chắn clear đúng cookie
  };

  // clear access token
  res.clearCookie("accessToken", cookieOptions);

  // clear refresh token
  res.clearCookie("refreshToken", cookieOptions);

  // clear CSRF token (nếu bạn đang lưu trong cookie)
  res.clearCookie("XSRF-TOKEN", {
    httpOnly: false,
    sameSite: process.env.REACT_APP_NODE_ENV === "production" ? "None" : "Lax",
    secure: process.env.REACT_APP_NODE_ENV === "production",
  });

  return res.status(200).json({ message: "Logged out" });
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

    const isProd = process.env.REACT_APP_NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProd, // chỉ bật HTTPS khi production
      sameSite: isProd ? "None" : "Lax",
      path: "/", // thêm cái này để chắc chắn clear đúng cookie
    };

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};
