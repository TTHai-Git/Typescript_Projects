import { Schema, model } from "mongoose";

const OrderDetailsSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: "Order", required: true }, // Reference to Order
  dog: { type: Schema.Types.ObjectId, ref: "Dog", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderDetails = model("OrderDetails", OrderDetailsSchema);
export default OrderDetails;
