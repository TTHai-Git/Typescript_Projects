import { Router } from "express";
import {
  caculateShipmentFee,
  createShipment,
  getShipmentOfOrder,
} from "../controllers/shipment.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { csrfMiddleware } from "../middleware/csrf.js";

const shipmentRoutes = Router();
shipmentRoutes.get("/order/:orderId", authMiddleware, getShipmentOfOrder);
shipmentRoutes.post("/", authMiddleware, csrfMiddleware, createShipment);
shipmentRoutes.post(
  "/calculate-fee",
  authMiddleware,
  csrfMiddleware,
  caculateShipmentFee
);
export default shipmentRoutes;
