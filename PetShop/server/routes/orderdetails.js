import { Router } from "express";
import { createOrderDetails } from "../controllers/orderDetails.js";

const orderDetailsRoutes = Router();
orderDetailsRoutes.post("/", createOrderDetails);

export default orderDetailsRoutes;
