import { Router } from "express";
import {
  getCategories,
  getCatgoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
const categoryRoutes = Router();

categoryRoutes.get("/", getCategories);
categoryRoutes.get("/:cate_id", getCatgoryById);
categoryRoutes.post("/", authMiddleware, isAdmin, createCategory);
categoryRoutes.put("/:cate_id", authMiddleware, isAdmin, updateCategory);
categoryRoutes.delete("/:cate_id", authMiddleware, isAdmin, deleteCategory);

export default categoryRoutes;
