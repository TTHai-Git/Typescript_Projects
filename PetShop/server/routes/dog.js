import { Router } from "express";
import {
  getDogs,
  getDog,
  createDog,
  updateDog,
  deleteDog,
} from "../controllers/dog.js";

const dogRoutes = Router();

dogRoutes.get("/:page", getDogs);
dogRoutes.get("/:page/dog/:id/info", getDog);
dogRoutes.post("/", createDog);
dogRoutes.put("/:id", updateDog);
dogRoutes.delete("/:id", deleteDog);

export default dogRoutes;
