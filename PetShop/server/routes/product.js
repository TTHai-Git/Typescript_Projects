import Router from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} from "../controllers/product.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const productRoutes = Router();

productRoutes.get("/", getAllProducts);
productRoutes.get("/:type/:product_id", getProductById);
productRoutes.post("/", authMiddleware, isAdmin, createProduct);
// productRoutes.put("/:product_id", authMiddleware, isAdmin, updateProduct);
productRoutes.delete("/:product_id", authMiddleware, isAdmin, deleteProduct);
// productRoutes.put("/update-stock/:product_id", updateStock);

export default productRoutes;
