import Router from "express";
import {
  createVendor,
  deleteVendor,
  getVendorById,
  getVendors,
  updateVendor,
} from "../controllers/vendor.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { secureMiddleware } from "../middleware/secureMiddleware.js";

const vendorRouter = Router();

vendorRouter.get("/", getVendors);
vendorRouter.get("/:vendor_id", getVendorById);
vendorRouter.post("/", secureMiddleware, isAdmin, createVendor);
vendorRouter.put("/:vendor_id", secureMiddleware, isAdmin, updateVendor);
vendorRouter.delete("/:vendor_id", secureMiddleware, isAdmin, deleteVendor);

export default vendorRouter;
