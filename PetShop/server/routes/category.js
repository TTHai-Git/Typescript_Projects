import { Router } from "express";
import {
  getCategories,
  getCatgoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { secureMiddleware } from "../middleware/secureMiddleware.js";
const categoryRoutes = Router();

categoryRoutes.get("/", getCategories);
categoryRoutes.get("/:cate_id", getCatgoryById);
categoryRoutes.post("/", secureMiddleware, isAdmin, createCategory);
categoryRoutes.put("/:cate_id", secureMiddleware, isAdmin, updateCategory);
categoryRoutes.delete("/:cate_id", secureMiddleware, isAdmin, deleteCategory);

export default categoryRoutes;
