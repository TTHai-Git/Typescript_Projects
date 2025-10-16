import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { deleteCommentDetails } from "../controllers/commentdetails.js";
import { csrfMiddleware } from "../middleware/csrf.js";

const commentDetailsRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: CommentDetails
 *   description: Endpoints for managing comment details of comments (images)
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: apiKey
 *       in: cookie
 *       name: accessToken
 *       description: >
 *         JWT access token stored in HttpOnly cookie named `accessToken`.
 *         This token is verified by `authMiddleware`.
 *     csrfAuth:
 *       type: apiKey
 *       in: header
 *       name: X-CSRF-Token
 *       description: >
 *         CSRF protection header that must match the value of the `XSRF-TOKEN` cookie.
 *     isAdminAuth:
 *       type: apiKey
 *       in: header
 *       name: adminKey
 *       description: > 
 *         To protect methods POST, PUT, PATCH, DELETE for APIs of Admin.
 */

/**
 * @swagger
 * /v1/comment-details/{commentDetailsId}:
 *   delete:
 *     summary: Delete a specific comment detail (image or file)
 *     description: Delete a comment detail by its ID and remove its image from Cloudinary.
 *       Requires authentication and a valid CSRF token.
 *     tags: [CommentDetails]
 *     security:
 *       - bearerAuth: []     # JWT auth
 *       - csrfToken: []      # CSRF protection
 *     parameters:
 *       - in: path
 *         name: commentDetailsId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment detail to delete
 *     responses:
 *       204:
 *         description: Comment detail deleted successfully (no content returned)
 *       404:
 *         description: Comment detail not found
 *       500:
 *         description: Server error
 */
commentDetailsRoutes.delete(
  "/:commentDetailsId",
  authMiddleware,
  csrfMiddleware,
  deleteCommentDetails
);

commentDetailsRoutes.delete(
  "/:commentDetailsId",
  authMiddleware,
  csrfMiddleware,
  deleteCommentDetails
);
export default commentDetailsRoutes;
