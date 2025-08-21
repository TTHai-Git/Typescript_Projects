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
import { secureMiddleware } from "../middleware/secureMiddleware.js";

const generateCrudRoutes = (Model, modelName, options = {}) => {
  const router = Router();

  router.post("/", secureMiddleware, isAdmin, createOne(Model, modelName));
  router.get("/", secureMiddleware, isAdmin, readAll(Model, modelName, options));
  router.get(
    "/all",
    authMiddleware,
    isAdmin,
    loadDataForComboboxInForm(Model, modelName)
  );
  router.get("/:id", authMiddleware, isAdmin, readOne(Model, modelName));
  router.put("/:id", secureMiddleware, isAdmin, updateOne(Model, modelName));
  router.delete("/:id", secureMiddleware, isAdmin, deleteOne(Model));

  return router;
};

export default generateCrudRoutes;
