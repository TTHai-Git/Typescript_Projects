import { Router } from "express";
import {
  createdBreed,
  deleteBreedById,
  getAllBreeds,
  getBreedById,
  updateBreed,
} from "../controllers/breed.js";

const breedRoutes = Router();

breedRoutes.get("/", getAllBreeds);
breedRoutes.get("/:breedId", getBreedById);
breedRoutes.post("/", createdBreed);
breedRoutes.put("/:breedId", updateBreed);
breedRoutes.delete("/:breedId", deleteBreedById);

export default breedRoutes;
