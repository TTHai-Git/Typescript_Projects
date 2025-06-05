import { Router } from "express";
import {
  createOrder,
  getOrdersOfCustomer,
  getOrderDetails,
  updateStatusOfOrder,
  getOrder,
} from "../controllers/order.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const orderRoutes = Router();
orderRoutes.post("/", authMiddleware, createOrder);
orderRoutes.get("/user/:user_id", authMiddleware, getOrdersOfCustomer);
orderRoutes.get("/:orderId/orderDetails/", authMiddleware, getOrderDetails);
orderRoutes.get("/:orderId", authMiddleware, getOrder);
orderRoutes.put("/:orderId", authMiddleware, updateStatusOfOrder);

export default orderRoutes;
