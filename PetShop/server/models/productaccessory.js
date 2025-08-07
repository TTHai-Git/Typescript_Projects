import Product from "../models/product.js";
import { Schema } from "mongoose";

const AccessorySchema = new Schema({
  dimensions: { type: String }, // "10x5x2 cm"
  material: { type: [String] },
  usage: { type: String }, // "grooming", "training"
});

const AccessoryProduct = Product.discriminator("accessory", AccessorySchema);

export default AccessoryProduct;
