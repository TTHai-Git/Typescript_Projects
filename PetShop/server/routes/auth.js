import { Router } from "express";
import {
  authMe,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/auth.js";
import { verifyEmail } from "../controllers/verifyController.js";
import { secureMiddleware } from "../middleware/secureMiddleware.js";
const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", secureMiddleware, authMe);
authRoutes.post("/refresh", secureMiddleware, refreshAccessToken);
authRoutes.post("/verify-email", verifyEmail);

export default authRoutes;
