import User from "../models/user.js";
import "../config/dotenv.config.js"; // ✅ loads environment variables once

export const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("role");
  const adminkey = req.headers["adminkey"]
  if (user.role.name !== "Admin" || !adminkey || adminkey !== process.env.adminKey) {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
