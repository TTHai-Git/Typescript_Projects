import { Router } from "express";
import {
  authMe,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/auth.js";
import { verifyEmail } from "../controllers/verifyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { csrfMiddleware } from "../middleware/csrf.js";
const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", authMiddleware, csrfMiddleware, authMe);
authRoutes.post("/refresh", authMiddleware, csrfMiddleware, refreshAccessToken);
authRoutes.post("/verify-email", verifyEmail);

export default authRoutes;
