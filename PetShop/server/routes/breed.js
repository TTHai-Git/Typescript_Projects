import { Router } from "express";
import {
  createdBreed,
  deleteBreedById,
  getAllBreeds,
  getBreedById,
  updateBreed,
} from "../controllers/breed.js";

import { isAdmin } from "../middleware/isAdmin.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const breedRoutes = Router();

breedRoutes.get("/", getAllBreeds);
breedRoutes.get("/:breedId", getBreedById);
breedRoutes.post("/", authMiddleware, csrfMiddleware, isAdmin, createdBreed);
breedRoutes.put(
  "/:breedId",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  updateBreed
);
breedRoutes.delete(
  "/:breedId",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  deleteBreedById
);

export default breedRoutes;
