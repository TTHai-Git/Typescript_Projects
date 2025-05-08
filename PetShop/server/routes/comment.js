import { Router } from "express";
import { addComment, getCommnetsByProduct } from "../controllers/comment.js";
const commentRoutes = Router();

commentRoutes.post("/", addComment);
commentRoutes.get("/product/:productId", getCommnetsByProduct);

export default commentRoutes;
