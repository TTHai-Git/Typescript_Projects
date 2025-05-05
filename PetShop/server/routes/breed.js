import { Router } from "express";
import {
  createdBreed,
  deleteBreedById,
  getAllBreeds,
  getBreedById,
  updateBreed,
} from "../controllers/breed.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const breedRoutes = Router();

breedRoutes.get("/", getAllBreeds);
breedRoutes.get("/:breedId", getBreedById);
breedRoutes.post("/", authMiddleware, isAdmin, createdBreed);
breedRoutes.put("/:breedId", authMiddleware, isAdmin, updateBreed);
breedRoutes.delete("/:breedId", authMiddleware, isAdmin, deleteBreedById);

export default breedRoutes;
