import { Schema, model } from "mongoose";

const voucherSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discount: {
      type: Number,
      requried: true,
      min: 0,
      max: 100,
    },
    expiryDate: {
      type: Date,
      requried: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    maxUsage: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);
const Voucher = model("Voucher", voucherSchema);

export default Voucher;
