import Router from "express";
import {
  createBrand,
  deleteBrand,
  getbrandById,
  getBrands,
  updateBrand,
} from "../controllers/brand.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { secureMiddleware } from "../middleware/secureMiddleware.js";
const brandRouter = Router();

brandRouter.get("/", getBrands);
brandRouter.get("/:brand_id", getbrandById);
brandRouter.post("/", secureMiddleware, isAdmin, createBrand);
brandRouter.put("/:brand_id", secureMiddleware, isAdmin, updateBrand);
brandRouter.delete("/:brand_id", secureMiddleware, isAdmin, deleteBrand);

export default brandRouter;
