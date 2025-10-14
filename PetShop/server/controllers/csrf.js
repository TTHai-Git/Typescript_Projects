import crypto from "crypto";
import "../config/dotenv.config.js"; // ✅ loads environment variables once
export const generateCSRFToken = (req, res) => {
    const token = crypto.randomBytes(32).toString("hex");
    res.cookie("XSRF-TOKEN", token, {
    httpOnly: false,
    sameSite: process.env.REACT_APP_NODE_ENV === "production" ? "None" : "Lax",
    secure: process.env.REACT_APP_NODE_ENV === "production",
    });
    return res.status(200).json({ csrfToken: token });
}