import { Router } from "express";
import { createOrderDetails } from "../controllers/orderdetails.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const orderDetailsRoutes = Router();
orderDetailsRoutes.post(
  "/",
  authMiddleware,
  csrfMiddleware,
  createOrderDetails
);

export default orderDetailsRoutes;
