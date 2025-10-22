import speakeasy from "speakeasy";
import QRCode from "qrcode";
import User from "../models/user.js";
export const generateQR = async (req, res) => {
  const secret = speakeasy.generateSecret({
    name: "DogShop",
    length: 20,
  });
  const QRCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
  return res.status(200).json({
    secret: secret.base32,
    // otpauth_url: secret.otpauth_url,
    QRCodeUrl: QRCodeUrl,
  });
};

export const verifyTOTP = async (req, res) => {
  try {
    const { totp, secret, userId } = req.body;
    // console.log("req.body", req.body);

    // Get secret: from DB if user already has 2FA enabled
    let secretKey = secret;
    if (!secretKey && userId) {
      const user = await User.findById(userId);
      if (!user || !user.secretKey2FA)
        return res.status(404).json({ message: "No 2FA secret found" });
      secretKey = user.secretKey2FA;
    }
    // console.log("secretKey", secretKey);

    const isVerified2FA = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: totp,
    });
    // console.log("isVerified2FA", isVerified2FA);
    if (isVerified2FA) {
      return res.status(200).json({
        isVerified2FA: true,
        message: "Two-Factor Authentication successful!",
      });
    } else {
      return res.status(400).json({
        isVerified2FA: false,
        message: "Invalid or expired 2FA code!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error verifying 2FA" });
  }
};
