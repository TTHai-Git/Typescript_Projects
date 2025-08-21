import { Router } from "express";
import {
  addComment,
  deleteComment,
  getComment,
  getCommentsByProduct,
  updateComment,
} from "../controllers/comment.js";
import { secureMiddleware } from "../middleware/secureMiddleware.js";
const commentRoutes = Router();

commentRoutes.post("/", secureMiddleware, addComment);
commentRoutes.get("/product/:productId", getCommentsByProduct);
commentRoutes.get("/:commentId", getComment);
commentRoutes.delete("/:commentId", secureMiddleware, deleteComment);
commentRoutes.put("/:commentId", secureMiddleware, updateComment);

export default commentRoutes;
