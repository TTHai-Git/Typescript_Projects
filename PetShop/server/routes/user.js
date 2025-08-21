import { Router } from "express";
import {
  generateOTP,
  resetPassword,
  updateInfor,
} from "../controllers/user.js";
import { secureMiddleware } from "../middleware/secureMiddleware.js";

const userRoutes = Router();

userRoutes.put("/:user_id/update-infor", secureMiddleware, updateInfor);
userRoutes.post("/generate-otp", generateOTP);
// userRoutes.post("/verify-otp", verifyOTP);
userRoutes.put("/reset-password", resetPassword);
export default userRoutes;
