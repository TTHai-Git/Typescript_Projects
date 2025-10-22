import { Router } from "express";
import { generateQR, verifyTOTP } from "../controllers/2fa.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { csrfMiddleware } from "../middleware/csrf.js";
const authenticate_2fa_Router = Router();

authenticate_2fa_Router.get("/generate-qr", generateQR);
authenticate_2fa_Router.post("/verify-totp", authMiddleware, verifyTOTP);

export default authenticate_2fa_Router;
