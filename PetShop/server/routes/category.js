import { Router } from "express";
import {
  getCategories,
  getCatgoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const categoryRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints for managing Categories Of Products
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
 */

/**
 * @swagger
 * /v1/categories:
 *   get:
 *     summary: Retrieve all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 652a1f9e8d1a2b3c4d5e6f7a
 *                   name:
 *                     type: string
 *                     example: Dog Food
 *                   status:
 *                     type: boolean
 *                     example: true
 *                   description:
 *                     type: string
 *                     example: High quality food for all breeds
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No categories found
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Accessories
 *               status:
 *                 type: boolean
 *                 example: true
 *               description:
 *                 type: string
 *                 example: All types of pet accessories
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doc:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 652a1f9e8d1a2b3c4d5e6f7a
 *                     name:
 *                       type: string
 *                       example: Accessories
 *                     description:
 *                       type: string
 *                       example: All types of pet accessories
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: Category created successfully
 *       400:
 *         description: Category already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /v1/categories/{cate_id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: cate_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 652a1f9e8d1a2b3c4d5e6f7a
 *                 name:
 *                   type: string
 *                   example: Toys
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 description:
 *                   type: string
 *                   example: Pet toys for all sizes
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *     parameters:
 *       - in: path
 *         name: cate_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Category Name
 *               description:
 *                 type: string
 *                 example: Updated description for the category
 *               status:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Update data is required
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *     parameters:
 *       - in: path
 *         name: cate_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */

categoryRoutes.get("/", getCategories);
categoryRoutes.get("/:cate_id", getCatgoryById);
categoryRoutes.post(
  "/",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  createCategory
);
categoryRoutes.put(
  "/:cate_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  updateCategory
);
categoryRoutes.delete(
  "/:cate_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  deleteCategory
);

export default categoryRoutes;
