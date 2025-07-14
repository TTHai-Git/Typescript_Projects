import { Router } from "express";
import { createVoucher, deleteVoucher, getVoucher, updateVoucher} from "../controllers/voucher.js";

const voucherRouter = Router()
voucherRouter.get("/:voucherId",getVoucher)
voucherRouter.post("/",createVoucher)
voucherRouter.put("/:voucherId", updateVoucher)
voucherRouter.delete("/:voucherId", deleteVoucher)

export default voucherRouter;