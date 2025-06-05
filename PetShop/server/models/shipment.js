import { Schema, model } from "mongoose";

const ShipmentSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["At the store", "Delivery"],
      required: true,
    },
    // provider: {
    //   type: String,
    //   enum: ["Manual", "VNPost", "GiaoHangNhanh", "GiaoHangTietKiem"],
    // },
    buyerName: {
      type: String,
      required: true,
    },
    buyerPhone: {
      type: String,
      required: true,
    },
    buyerAddress: {
      type: String,
      requried: true,
    },
    fee: {
      type: Number,
      default: 0,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  {
    timestamps: true,
  }
);
const Shipment = model("Shipment", ShipmentSchema);
export default Shipment;
