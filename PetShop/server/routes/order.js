import { Router } from "express";
import {
  createOrder,
  getOrdersOfCustomer,
  getOrderDetails,
} from "../controllers/order.js";
const orderRoutes = Router();
orderRoutes.post("/", createOrder);
orderRoutes.get("/:user_id/:page", getOrdersOfCustomer);
orderRoutes.get("/:orderId/orderDetails/:page", getOrderDetails);

export default orderRoutes;
