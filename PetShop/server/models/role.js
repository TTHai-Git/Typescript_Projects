import { model, Schema } from "mongoose";

const roleSchema = new Schema(
  {
    name: {
      type: String,
      enum: ["Admin", "Staff", "User"],
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Role = model("Role", roleSchema);

export default Role;
