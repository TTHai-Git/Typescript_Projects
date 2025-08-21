import { Router } from "express";
import { createOrderDetails } from "../controllers/orderdetails.js";
import { secureMiddleware } from "../middleware/secureMiddleware.js";

const orderDetailsRoutes = Router();
orderDetailsRoutes.post("/", secureMiddleware, createOrderDetails);

export default orderDetailsRoutes;
