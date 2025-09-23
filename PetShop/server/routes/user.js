import { Router } from "express";
import {
  generateOTP,
  resetPassword,
  updateAvatar,
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
userRoutes.put(
  "/:user_id/update-avatar",
  updateAvatar
);
userRoutes.post("/generate-otp", generateOTP);
// userRoutes.post("/verify-otp", verifyOTP);
userRoutes.put("/reset-password", resetPassword);
export default userRoutes;
