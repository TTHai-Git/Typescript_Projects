import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true, length: 6 },
    name: { type: String },
    avatar: { type: String },
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    address: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
