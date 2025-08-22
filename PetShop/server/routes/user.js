import { Router } from "express";
import {
  generateOTP,
  resetPassword,
  updateInfor,
} from "../controllers/user.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRoutes = Router();

userRoutes.put(
  "/:user_id/update-infor",
  authMiddleware,
  csrfMiddleware,
  updateInfor
);
userRoutes.post("/generate-otp", generateOTP);
// userRoutes.post("/verify-otp", verifyOTP);
userRoutes.put("/reset-password", resetPassword);
export default userRoutes;
