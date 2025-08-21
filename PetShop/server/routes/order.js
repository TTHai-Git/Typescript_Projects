import { Router } from "express";
import {
  createOrder,
  getOrdersOfCustomer,
  getOrderDetails,
  updateStatusOfOrder,
  getOrder,
} from "../controllers/order.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { secureMiddleware } from "../middleware/secureMiddleware.js";

const orderRoutes = Router();
orderRoutes.post("/", secureMiddleware, createOrder);
orderRoutes.get("/user/:user_id", authMiddleware, getOrdersOfCustomer);
orderRoutes.get("/:orderId/orderDetails/", authMiddleware, getOrderDetails);
orderRoutes.get("/:orderId", authMiddleware, getOrder);
orderRoutes.put("/:orderId", secureMiddleware, updateStatusOfOrder);

export default orderRoutes;
