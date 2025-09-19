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
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    minimumPrice: {
      type: Number,
      require: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    maxUsage: {
      type: Number,
      default: 100,
    },
    type: {
      type: String,
      enum: ["Order", "Shipment"],
      require: true,
    },
    description: {
      type: String,
      default: "None",
    },
  },
  {
    timestamps: true,
  }
);
const Voucher = model("Voucher", voucherSchema);

export default Voucher;
