import { Router } from "express";
import {
  createVoucher,
  deleteVoucher,
  getVoucher,
  updateVoucher,
} from "../controllers/voucher.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { secureMiddleware } from "../middleware/secureMiddleware.js";

const voucherRouter = Router();
voucherRouter.get("/:voucherId", getVoucher);
voucherRouter.post("/", secureMiddleware, isAdmin, createVoucher);
voucherRouter.put("/:voucherId", secureMiddleware, isAdmin, updateVoucher);
voucherRouter.delete("/:voucherId", secureMiddleware, isAdmin, deleteVoucher);

export default voucherRouter;
