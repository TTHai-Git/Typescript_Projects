import { Schema, model } from "mongoose";

const DogSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    breed: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Dog = model("Dog", DogSchema);
export default Dog;
