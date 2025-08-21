import { Router } from "express";
import {
  createdBreed,
  deleteBreedById,
  getAllBreeds,
  getBreedById,
  updateBreed,
} from "../controllers/breed.js";
import { secureMiddleware } from "../middleware/secureMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const breedRoutes = Router();

breedRoutes.get("/", getAllBreeds);
breedRoutes.get("/:breedId", getBreedById);
breedRoutes.post("/", secureMiddleware, isAdmin, createdBreed);
breedRoutes.put("/:breedId", secureMiddleware, isAdmin, updateBreed);
breedRoutes.delete("/:breedId", secureMiddleware, isAdmin, deleteBreedById);

export default breedRoutes;
