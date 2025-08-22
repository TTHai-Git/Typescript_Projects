import { Router } from "express";
import {
  addComment,
  deleteComment,
  getComment,
  getCommentsByProduct,
  updateComment,
} from "../controllers/comment.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const commentRoutes = Router();

commentRoutes.post("/", authMiddleware, csrfMiddleware, addComment);
commentRoutes.get("/product/:productId", getCommentsByProduct);
commentRoutes.get("/:commentId", getComment);
commentRoutes.delete(
  "/:commentId",
  authMiddleware,
  csrfMiddleware,
  deleteComment
);
commentRoutes.put("/:commentId", authMiddleware, csrfMiddleware, updateComment);

export default commentRoutes;
