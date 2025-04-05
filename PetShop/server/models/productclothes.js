// models/ProductClothes.ts
import Product from "../models/product.js";
import { Schema } from "mongoose";

const ClothesSchema = new Schema({
  size: [String], // "S", "M", "L", "XL"
  material: [String], // "cotton", "polyester", etc.
  color: [String], // "red", "blue", "green", etc.
  season: { type: String }, // "summer", "winter"
});

const ClothesProduct = Product.discriminator("clothes", ClothesSchema);

export default ClothesProduct;
