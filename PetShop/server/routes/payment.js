import Router from "express";
import { createPaymentForOrder } from "../controllers/payment.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const paymentRoutes = Router();
paymentRoutes.post("/", createPaymentForOrder);
export default paymentRoutes;
