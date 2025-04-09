import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    status: { type: Boolean, default: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  },
  {
    timestamps: true,
  }
);

const Product = model("Product", ProductSchema);

export default Product;
