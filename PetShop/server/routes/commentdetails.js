import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { deleteCommentDetails } from "../controllers/commentdetails.js";
import { csrfMiddleware } from "../middleware/csrf.js";

const commentDetailsRoutes = Router();
commentDetailsRoutes.delete(
  "/:commentDetailsId",
  authMiddleware,
  csrfMiddleware,
  deleteCommentDetails
);
export default commentDetailsRoutes;
