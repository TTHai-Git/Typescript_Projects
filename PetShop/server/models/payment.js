import { Schema, model } from "mongoose";

const PaymentSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["Cash", "VNPay", "PAYOS"],
      required: true,
    },
    provider: {
      type: String,
      enum: ["Manual", "VNPay", "PAYOS"],
      default: "Manual", // For Cash
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    extraData: {
      type: Schema.Types.Mixed, // Store provider-specific data (receipt_url, card type, etc.)
      default: {},
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

const Payment = model("Payment", PaymentSchema);
export default Payment;
