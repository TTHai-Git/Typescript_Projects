import { Router } from "express";
import {
  addComment,
  deleteComment,
  getComment,
  getCommentsByProduct,
  updateComment,
} from "../controllers/comment.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const commentRoutes = Router();

commentRoutes.post("/", authMiddleware, addComment);
commentRoutes.get("/product/:productId", getCommentsByProduct);
commentRoutes.get("/:commentId", getComment);
commentRoutes.delete("/:commentId", authMiddleware, deleteComment);
commentRoutes.put("/:commentId", authMiddleware, updateComment);

export default commentRoutes;
