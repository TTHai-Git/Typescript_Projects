import Router from "express";
import {
  createVendor,
  deleteVendor,
  getVendorById,
  getVendors,
  updateVendor,
} from "../controllers/vendor.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const vendorRouter = Router();

vendorRouter.get("/", getVendors);
vendorRouter.get("/:vendor_id", getVendorById);
vendorRouter.post("/", authMiddleware, csrfMiddleware, isAdmin, createVendor);
vendorRouter.put(
  "/:vendor_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  updateVendor
);
vendorRouter.delete(
  "/:vendor_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  deleteVendor
);

export default vendorRouter;
