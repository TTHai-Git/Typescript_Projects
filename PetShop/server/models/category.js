import { Schema, model } from "mongoose";
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Category = model("category", CategorySchema);
export default Category;
