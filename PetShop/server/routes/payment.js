import Router from "express";
import {
  createPaymentForOrder,
  getPaymentDetailsForOrder,
  getPaymentForOrder,
} from "../controllers/payment.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const paymentRoutes = Router();
paymentRoutes.post("/", authMiddleware, createPaymentForOrder);
paymentRoutes.get("/:paymentId", getPaymentDetailsForOrder);
paymentRoutes.get("/order/:orderId", getPaymentForOrder);
export default paymentRoutes;
