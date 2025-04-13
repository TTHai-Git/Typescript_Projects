import { Schema, model } from "mongoose";

const OrderDetailsSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: "Order", required: true }, // Reference to Order
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  note: { type: String, required: true, default: "" },
});

const OrderDetails = model("OrderDetails", OrderDetailsSchema);
export default OrderDetails;
