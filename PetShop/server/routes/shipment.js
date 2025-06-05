import { Router } from "express";
import {
  caculateShipmentFee,
  createShipment,
  getShipmentOfOrder,
} from "../controllers/shipment.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const shipmentRoutes = Router();
shipmentRoutes.get("/order/:orderId", authMiddleware, getShipmentOfOrder);
shipmentRoutes.post("/", authMiddleware, createShipment);
shipmentRoutes.post("/calculate-fee", authMiddleware, caculateShipmentFee);
export default shipmentRoutes;
