import Router from "express";
import {
  createProduct,
  DeleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.js";

const productRoutes = Router();

productRoutes.get("/", getAllProducts);
productRoutes.get("/:product_id", getProductById);
productRoutes.post("/", createProduct);
productRoutes.put("/:product_id", updateProduct);
productRoutes.delete("/:product_id", DeleteProduct);

export default productRoutes;
