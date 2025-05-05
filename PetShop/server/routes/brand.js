import Router from "express";
import {
  createBrand,
  deleteBrand,
  getbrandById,
  getBrands,
  updateBrand,
} from "../controllers/brand.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
const brandRouter = Router();

brandRouter.get("/", getBrands);
brandRouter.get("/:brand_id", getbrandById);
brandRouter.post("/", authMiddleware, isAdmin, createBrand);
brandRouter.put("/:brand_id", authMiddleware, isAdmin, updateBrand);
brandRouter.delete("/:brand_id", authMiddleware, isAdmin, deleteBrand);

export default brandRouter;
