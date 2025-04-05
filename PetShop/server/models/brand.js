import { Schema, model } from "mongoose";

const BrandSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    logoUrl: { type: String },
  },
  { timestamps: true }
);

const Brand = model("Brand", BrandSchema);

export default Brand;
