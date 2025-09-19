import { Router } from "express";
import {
  createManyVouchers,
  createVoucher,
  deleteVoucher,
  getAvailableVouchersForOrders,
  getAvailableVouchersForShipment,
  getVoucher,
  updateVoucher,
  updateVoucherUsageForUser,
} from "../controllers/voucher.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const voucherRouter = Router();

voucherRouter.get("/:voucherId", getVoucher);
voucherRouter.get("/available/for-orders", getAvailableVouchersForOrders);
voucherRouter.get("/available/for-shipments", getAvailableVouchersForShipment);

voucherRouter.post("/", authMiddleware, csrfMiddleware, isAdmin, createVoucher);
// voucherRouter.post("/", createVoucher);
// voucherRouter.post("/create-many", createManyVouchers);

voucherRouter.put(
  "/:voucherId",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  updateVoucher
);
// voucherRouter.put("/:voucherId", updateVoucher);
voucherRouter.patch(
  "/:voucherId/usage",
  authMiddleware,
  csrfMiddleware,
  updateVoucherUsageForUser
);

voucherRouter.delete(
  "/:voucherId",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  deleteVoucher
);
// voucherRouter.delete("/:voucherId", deleteVoucher);

export default voucherRouter;
