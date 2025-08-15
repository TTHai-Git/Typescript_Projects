import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  authMe,
  login,
  logout,
  protectedRoute,
  refreshAccessToken,
  register,
} from "../controllers/auth.js";
import { verifyEmail } from "../controllers/verifyController.js";
const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/protected", authMiddleware, protectedRoute);
authRoutes.get("/me", authMiddleware, authMe);
// authRoutes.post("/refresh", authMiddleware, refreshAccessToken);
authRoutes.post("/verify-email", verifyEmail);

export default authRoutes;
