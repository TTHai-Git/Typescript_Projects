import { Router } from "express";
import {
  addComment,
  checkIsOrderAndIsPayment,
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
commentRoutes.get(
  "/check/is-make-orders-and-paid",
  authMiddleware,
  checkIsOrderAndIsPayment
);
commentRoutes.delete(
  "/:commentId",
  authMiddleware,
  csrfMiddleware,
  deleteComment
);
commentRoutes.put("/:commentId", authMiddleware, csrfMiddleware, updateComment);

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Endpoints for managing product comments and reviews
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
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         productId:
 *           type: string
 *         content:
 *           type: string
 *           example: "Excellent quality, fast shipping!"
 *         rating:
 *           type: number
 *           example: 5
 *         urls:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CommentWithUrls:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         product:
 *           type: string
 *         content:
 *           type: string
 *         rating:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         commentDetails_ids:
 *           type: array
 *           items:
 *             type: string
 *         urls:
 *           type: array
 *           items:
 *             type: string
 *         public_ids:
 *           type: array
 *           items:
 *             type: string
 *
 */

/**
 * @swagger
 * /v1/comments:
 *   post:
 *     summary: Add a comment for a product
 *     description: Creates a new comment with optional image URLs and rating.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *       - isAdminAuth: []  # Requires adminKey header

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *               - content
 *               - rating
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 6707ab4c9cf2e20b9f9d92f1
 *               productId:
 *                 type: string
 *                 example: 6707ab4c9cf2e20b9f9d92f5
 *               content:
 *                 type: string
 *                 example: "Great quality product, my dog loves it!"
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               urls:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "https://res.cloudinary.com/.../image1.jpg"
 *               public_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "comment_image_123"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /v1/comments/product/{productId}:
 *   get:
 *     summary: Get comments for a specific product
 *     description: Returns paginated comments with filtering and sorting options.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6707ab4c9cf2e20b9f9d92f5
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [latest, oldest]
 *           example: latest
 *     responses:
 *       200:
 *         description: List of comments for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 commentsWithUrls:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CommentWithUrls'
 *                 current:
 *                   type: integer
 *                   example: 1
 *                 pages:
 *                   type: integer
 *                   example: 3
 *                 total:
 *                   type: integer
 *                   example: 12
 *       400:
 *         description: No comments found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /v1/comments/{commentId}:
 *   get:
 *     summary: Get a single comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6710a5cdedb245bcf02a49e9
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentWithUrls'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /v1/comments/check/is-make-orders-and-paid:
 *   get:
 *     summary: Check if user has purchased and paid for a product
 *     description: Used to verify if a user can leave a comment (requires order with PAID status).
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6707ab4c9cf2e20b9f9d92f1
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6707ab4c9cf2e20b9f9d92f5
 *     responses:
 *       200:
 *         description: Returns true if the user has ordered and paid for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /v1/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     description: Deletes a comment and its associated images if it belongs to the authenticated user.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *       - csrfAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6710c82d5efb86a9a1ff56d2
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       403:
 *         description: Unauthorized to delete this comment
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /v1/comments/{commentId}:
 *   put:
 *     summary: Update an existing comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *       - csrfAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6710c82d5efb86a9a1ff56d2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - rating
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated review after a few weeks of use."
 *               rating:
 *                 type: number
 *                 example: 4
 *               urls:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "https://res.cloudinary.com/.../updated-image.jpg"
 *               public_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "updated_public_id_123"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
export default commentRoutes;
