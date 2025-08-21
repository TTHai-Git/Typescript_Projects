import { Router } from "express";
import {
  createVoucher,
  deleteVoucher,
  getVoucher,
  updateVoucher,
} from "../controllers/voucher.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const voucherRouter = Router();
voucherRouter.get("/:voucherId", getVoucher);
voucherRouter.post("/", authMiddleware, isAdmin, createVoucher);
voucherRouter.put("/:voucherId", authMiddleware, isAdmin, updateVoucher);
voucherRouter.delete("/:voucherId", authMiddleware, isAdmin, deleteVoucher);

export default voucherRouter;
