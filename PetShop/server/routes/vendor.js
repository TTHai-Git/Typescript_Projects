import Router from "express";
import {
  createVendor,
  deleteVendor,
  getVendorById,
  getVendors,
  updateVendor,
} from "../controllers/vendor.js";

const vendorRouter = Router();

vendorRouter.get("/", getVendors);
vendorRouter.get("/:vendor_id", getVendorById);
vendorRouter.post("/", createVendor);
vendorRouter.put("/:vendor_id", updateVendor);
vendorRouter.delete("/:vendor_id", deleteVendor);

export default vendorRouter;
