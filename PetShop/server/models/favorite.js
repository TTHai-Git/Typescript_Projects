import { model, Schema } from "mongoose";

const FavoritesSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    isFavorite: { type: Schema.Types.Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);
const Favorite = model("Favorite", FavoritesSchema);
export default Favorite;
