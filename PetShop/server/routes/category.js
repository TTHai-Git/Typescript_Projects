import { Router } from "express";
import {
  getCategories,
  getCatgoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";
const categoryRoutes = Router();

categoryRoutes.get("/", getCategories);
categoryRoutes.get("/:cate_id", getCatgoryById);
categoryRoutes.post("/", createCategory);
categoryRoutes.put("/:cate_id", updateCategory);
categoryRoutes.delete("/:cate_id", deleteCategory);

export default categoryRoutes;
