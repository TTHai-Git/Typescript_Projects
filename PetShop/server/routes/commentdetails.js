import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { deleteCommentDetails } from "../controllers/commentdetails.js";

const commentDetailsRoutes = Router();
commentDetailsRoutes.delete(
  "/:commentDetailsId",
  authMiddleware,
  deleteCommentDetails
);
export default commentDetailsRoutes;
