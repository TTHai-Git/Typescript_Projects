import { Router } from "express";
import {
  createVoucher,
  deleteVoucher,
  getVoucher,
  updateVoucher,
} from "../controllers/voucher.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const voucherRouter = Router();
voucherRouter.get("/:voucherId", getVoucher);
voucherRouter.post("/", authMiddleware, csrfMiddleware, isAdmin, createVoucher);
voucherRouter.put(
  "/:voucherId",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  updateVoucher
);
voucherRouter.delete(
  "/:voucherId",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  deleteVoucher
);

export default voucherRouter;
