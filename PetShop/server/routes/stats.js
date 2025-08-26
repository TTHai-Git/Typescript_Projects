import { Router } from "express";
import {
  getBestSellingProducts,
  revenueStatistics,
} from "../controllers/stats.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const statsRoutes = Router();
statsRoutes.get("/revenue", authMiddleware, isAdmin, revenueStatistics);
statsRoutes.get(
  "/selling-best-products",
  authMiddleware,
  isAdmin,
  getBestSellingProducts
);
export default statsRoutes;
