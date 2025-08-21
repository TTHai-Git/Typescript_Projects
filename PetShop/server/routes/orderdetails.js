import { Router } from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { createOrderDetails } from "../controllers/orderdetails.js";

const orderDetailsRoutes = Router();
orderDetailsRoutes.post("/", authMiddleware, createOrderDetails);

export default orderDetailsRoutes;
