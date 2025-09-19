import { model, Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "ORDER_UPDATE",
        "PROMOTION",
        "VOUCHER",
        "MESSAGE",
        "ALERT",
        "EVENT",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const Notification = model("Notification", notificationSchema);
export default Notification;
