import Router from "express";
import {
  createBrand,
  deleteBrand,
  getbrandById,
  getBrands,
  updateBrand,
} from "../controllers/brand.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { csrfMiddleware } from "../middleware/csrf.js";

const brandRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: API endpoints for managing Brands Of Products
 *
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
 * /v1/brands:
 *   get:
 *     summary: Retrieve a list of Brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: A list of Brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   logoUrl:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *
 *   post:
 *     summary: Create a new Brand
 *     tags: [Brands]
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
 *                 example: test brand
 *               logoUrl:
 *                 type: string
 *                 example: https://example.com/logo.png
 *               description:
 *                 type: string
 *                 example: test brand description
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 65123abc987
 *                 name:
 *                   type: string
 *                   example: Admin
 *                 description:
 *                   type: string
 *                   example: Brand with full access
 *                 logoUrl:
 *                   type: string
 *                   example: https://example.com/logo.png
 */

brandRouter.get("/", getBrands);
/**
 * @swagger
 * /v1/brands/{brand_id}:
 *   get:
 *     summary: Get Brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - name: brand_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand details
 *   put:
 *     summary: Update a Brands
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *     tags: [Brands]
 *     parameters:
 *       - name: brand_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
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
 *                 example: update brand
 *               logoUrl:
 *                 type: string
 *                 example: https://example.com/logo.png
 *               description:
 *                 type: string
 *                 example: update description
 *
 *   delete:
 *     summary: Delete a Brands
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *     tags: [Brands]
 *     parameters:
 *       - name: brand_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       400:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */
brandRouter.get("/:brand_id", getbrandById);
brandRouter.post("/", authMiddleware, csrfMiddleware, isAdmin, createBrand);
brandRouter.put(
  "/:brand_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  updateBrand
);
brandRouter.delete(
  "/:brand_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  deleteBrand
);

export default brandRouter;
