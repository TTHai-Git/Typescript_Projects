import User from "../models/user.js";

export const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("role");
  if (user.role.name !== "Admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
