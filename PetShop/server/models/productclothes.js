// models/ProductClothes.ts
import Product from "../models/product.js";
import { Schema } from "mongoose";

const ClothesSchema = new Schema({
  size: { type: [String] }, // "S", "M", "L", "XL"
  material: { type: [String] }, // "cotton", "polyester", etc.
  color: { type: [String] }, // "red", "blue", "green", etc.
  season: { type: String }, // "summer", "winter"
});

const ClothesProduct = Product.discriminator("clothes", ClothesSchema);

export default ClothesProduct;
