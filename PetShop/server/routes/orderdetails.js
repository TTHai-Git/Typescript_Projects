import { Router } from "express";
import { createOrderDetails } from "../controllers/orderDetails.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const orderDetailsRoutes = Router();
orderDetailsRoutes.post("/", authMiddleware, createOrderDetails);

export default orderDetailsRoutes;
