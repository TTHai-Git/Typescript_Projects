import { Router } from "express";
import {
  createOrder,
  getOrdersOfCustomer,
  getOrderDetails,
} from "../controllers/order.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const orderRoutes = Router();
orderRoutes.post("/", authMiddleware, createOrder);
orderRoutes.get("/:user_id/:page", authMiddleware, getOrdersOfCustomer);
orderRoutes.get(
  "/:orderId/orderDetails/:page",
  authMiddleware,
  getOrderDetails
);

export default orderRoutes;
