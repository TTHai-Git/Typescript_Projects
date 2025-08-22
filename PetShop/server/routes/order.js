import { Router } from "express";
import {
  createOrder,
  getOrdersOfCustomer,
  getOrderDetails,
  updateStatusOfOrder,
  getOrder,
} from "../controllers/order.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { csrfMiddleware } from "../middleware/csrf.js";

const orderRoutes = Router();
orderRoutes.post("/", authMiddleware, csrfMiddleware, createOrder);
orderRoutes.get("/user/:user_id", authMiddleware, getOrdersOfCustomer);
orderRoutes.get("/:orderId/orderDetails/", authMiddleware, getOrderDetails);
orderRoutes.get("/:orderId", authMiddleware, getOrder);
orderRoutes.put(
  "/:orderId",
  authMiddleware,
  csrfMiddleware,
  updateStatusOfOrder
);

export default orderRoutes;
