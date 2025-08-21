import { Router } from "express";
import {
  caculateShipmentFee,
  createShipment,
  getShipmentOfOrder,
} from "../controllers/shipment.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { secureMiddleware } from "../middleware/secureMiddleware.js";
const shipmentRoutes = Router();
shipmentRoutes.get("/order/:orderId", authMiddleware, getShipmentOfOrder);
shipmentRoutes.post("/", secureMiddleware, createShipment);
shipmentRoutes.post("/calculate-fee", secureMiddleware, caculateShipmentFee);
export default shipmentRoutes;
