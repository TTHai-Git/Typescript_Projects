import Router from "express";
import {
  createVendor,
  deleteVendor,
  getVendorById,
  getVendors,
  updateVendor,
} from "../controllers/vendor.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const vendorRouter = Router();

vendorRouter.get("/", getVendors);
vendorRouter.get("/:vendor_id", getVendorById);
vendorRouter.post("/", authMiddleware, isAdmin, createVendor);
vendorRouter.put("/:vendor_id", authMiddleware, isAdmin, updateVendor);
vendorRouter.delete("/:vendor_id", authMiddleware, isAdmin, deleteVendor);

export default vendorRouter;
