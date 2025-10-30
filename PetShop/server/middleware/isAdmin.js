import User from "../models/user.js";
import "../config/dotenv.config.js"; // ✅ loads environment variables once

export const isAdmin = async (req, res, next) => {
  try {
    // 1️⃣ Ensure the user exists
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    // 2️⃣ Fetch user with role
    const user = await User.findById(req.user.id).populate("role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Validate role
    const isAdminRole = user.role && user.role.name === "Admin";
    const adminkey = req.headers["adminkey"];

    if (!isAdminRole) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // 4️⃣ Optional: add admin key verification
    if (process.env.ADMIN_KEY && adminkey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ message: "Invalid admin key" });
    }

    // 5️⃣ Continue
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    return res
      .status(500)
      .json({ message: "Server error while verifying admin" });
  }
};
