import Router from "express";
import {
  createPaymentForOrder,
  getPaymentDetailsForOrder,
  getPaymentForOrder,
} from "../controllers/payment.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const paymentRoutes = Router();
paymentRoutes.post("/", authMiddleware, csrfMiddleware, createPaymentForOrder);
paymentRoutes.get("/:paymentId", getPaymentDetailsForOrder);
paymentRoutes.get("/order/:orderId", getPaymentForOrder);
export default paymentRoutes;
