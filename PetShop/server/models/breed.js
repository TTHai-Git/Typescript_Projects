import { model, Schema } from "mongoose";

const BreedSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Breed = model("Breed", BreedSchema);
export default Breed;
