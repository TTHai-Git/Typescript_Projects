import { model, Schema } from "mongoose";

const FavoritesSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  {
    timestamps: true,
  }
);
FavoritesSchema.index({ user: 1, product: 1 }, { unique: true });
const Favorite = model("Favorite", FavoritesSchema);
export default Favorite;
