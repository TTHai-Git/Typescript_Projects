import { Schema, model } from "mongoose";
const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    contactInfo: { type: String },
    address: { type: String },
    email: { type: String },
    phone: { type: String },
  },
  {
    timestamps: true,
  }
);

const Vendor = model("Vendor", VendorSchema);
export default Vendor;
