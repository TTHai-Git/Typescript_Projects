import Router from "express";
import {
  createBrand,
  deleteBrand,
  getbrandById,
  getBrands,
  updateBrand,
} from "../controllers/brand.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { csrfMiddleware } from "../middleware/csrf.js";

const brandRouter = Router();

brandRouter.get("/", getBrands);
brandRouter.get("/:brand_id", getbrandById);
brandRouter.post("/", authMiddleware, csrfMiddleware, isAdmin, createBrand);
brandRouter.put(
  "/:brand_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  updateBrand
);
brandRouter.delete(
  "/:brand_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  deleteBrand
);

export default brandRouter;
