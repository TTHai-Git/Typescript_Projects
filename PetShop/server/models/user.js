import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true, length: 8 },
    name: { type: String },
    avatar: { type: String },
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    address: { type: String },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    isVerified: { type: Boolean, default: false },
    isAuthenticated2Fa: { type: Boolean, default: false },
    secretKey2FA: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
