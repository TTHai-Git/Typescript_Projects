import Router from "express";
import {
  createPaymentForOrder,
  getPaymentDetailsForOrder,
  getPaymentForOrder,
} from "../controllers/payment.js";
import { secureMiddleware } from "../middleware/secureMiddleware.js";
const paymentRoutes = Router();
paymentRoutes.post("/", secureMiddleware, createPaymentForOrder);
paymentRoutes.get("/:paymentId", getPaymentDetailsForOrder);
paymentRoutes.get("/order/:orderId", getPaymentForOrder);
export default paymentRoutes;
