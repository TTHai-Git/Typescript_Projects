import { Schema, model } from "mongoose";
import Product from "./product.js";

const DogSchema = new Schema({
  size: {
    type: [String],
    enum: ["small", "medium", "large"],
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  color: {
    type: [String],
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  breed: {
    type: Schema.Types.ObjectId,
    ref: "Breed",
    required: true,
  },
});

const DogProduct = Product.discriminator("dog", DogSchema);
export default DogProduct;
