import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { login, protectedRoute, register } from "../controllers/auth.js";
const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/protected", authMiddleware, protectedRoute);

export default authRoutes;
