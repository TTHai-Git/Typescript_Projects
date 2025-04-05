// models/ProductFood.ts
import Product from "../models/product.js";
import { Schema } from "mongoose";

const FoodSchema = new Schema({
  ingredients: [String],
  expirationDate: { type: Date },
  isGrainFree: { type: Boolean },
  recommendedFor: [String], // e.g. ["puppy", "adult cat"]
});

const FoodProduct = Product.discriminator("food", FoodSchema);

export default FoodProduct;
