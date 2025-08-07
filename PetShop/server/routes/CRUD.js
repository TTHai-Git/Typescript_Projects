// routes/generateCrudRoutes.js
import { Router } from "express";
import {
  createOne,
  deleteOne,
  loadDataForComboboxInForm,
  readAll,
  readOne,
  updateOne,
} from "../controllers/CRUD.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const generateCrudRoutes = (Model, modelName, options = {}) => {
  const router = Router();

  router.post("/", authMiddleware, isAdmin, createOne(Model, modelName));
  router.get("/", readAll(Model, modelName, options));
  router.get(
    "/all",
    authMiddleware,
    isAdmin,
    loadDataForComboboxInForm(Model, modelName)
  );
  router.get("/:id", authMiddleware, isAdmin, readOne(Model, modelName));
  router.put("/:id", authMiddleware, isAdmin, updateOne(Model, modelName));
  router.delete("/:id", authMiddleware, isAdmin, deleteOne(Model));

  return router;
};

export default generateCrudRoutes;
