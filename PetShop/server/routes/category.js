import { Router } from "express";
import {
  getCategories,
  getCatgoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const categoryRoutes = Router();

categoryRoutes.get("/", getCategories);
categoryRoutes.get("/:cate_id", getCatgoryById);
categoryRoutes.post(
  "/",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  createCategory
);
categoryRoutes.put(
  "/:cate_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  updateCategory
);
categoryRoutes.delete(
  "/:cate_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  deleteCategory
);

export default categoryRoutes;
