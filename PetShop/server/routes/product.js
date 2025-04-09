import Router from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.js";

const productRoutes = Router();

productRoutes.get("/", getAllProducts);
productRoutes.get("/:type/:product_id", getProductById);
productRoutes.post("/", createProduct);
productRoutes.put("/:product_id", updateProduct);
productRoutes.delete("/:product_id", deleteProduct);

export default productRoutes;
