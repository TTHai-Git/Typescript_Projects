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
import { csrfMiddleware } from "../middleware/csrf.js";

const generateCrudRoutes = (Model, modelName, options = {}) => {
  const router = Router();

  router.post(
    "/",
    authMiddleware,
    csrfMiddleware,
    isAdmin,
    createOne(Model, modelName)
  );
  router.get("/", authMiddleware, isAdmin, readAll(Model, modelName, options));
  router.get(
    "/all",
    authMiddleware,

    isAdmin,
    loadDataForComboboxInForm(Model, modelName)
  );
  router.get("/:id", authMiddleware, isAdmin, readOne(Model, modelName));
  router.put(
    "/:id",
    authMiddleware,
    csrfMiddleware,
    isAdmin,
    updateOne(Model, modelName)
  );
  router.delete(
    "/:id",
    authMiddleware,
    csrfMiddleware,
    isAdmin,
    deleteOne(Model)
  );

  return router;
};

export default generateCrudRoutes;
