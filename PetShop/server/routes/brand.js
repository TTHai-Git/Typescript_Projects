import Router from "express";
import {
  createBrand,
  deleteBrand,
  getbrandById,
  getBrands,
  updateBrand,
} from "../controllers/brand.js";
const brandRouter = Router();

brandRouter.get("/", getBrands);
brandRouter.get("/:brand_id", getbrandById);
brandRouter.post("/", createBrand);
brandRouter.put("/:brand_id", updateBrand);
brandRouter.delete("/:brand_id", deleteBrand);

export default brandRouter;
