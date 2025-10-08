import { Router } from "express";
import {
  createdBreed,
  deleteBreedById,
  getAllBreeds,
  getBreedById,
  updateBreed,
} from "../controllers/breed.js";

import { isAdmin } from "../middleware/isAdmin.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const breedRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Breeds
 *   description: API endpoints for managing Breeds Of Dogs
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
 * /v1/breeds:
 *   get:
 *     summary: Retrieve all breeds
 *     tags: [Breeds]
 *     responses:
 *       200:
 *         description: List of all dog breeds
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
 *                     example: Golden Retriever
 *                   description:
 *                     type: string
 *                     example: Friendly, intelligent, and devoted
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new breed
 *     tags: [Breeds]
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
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Husky
 *               description:
 *                 type: string
 *                 example: Energetic and outgoing working dog
 *     responses:
 *       201:
 *         description: Breed created successfully
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
 *                       example: Husky
 *                     description:
 *                       type: string
 *                       example: Energetic and outgoing working dog
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: Breed created successfully
 *       400:
 *         description: Name and description are required or breed already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /v1/breeds/{breedId}:
 *   get:
 *     summary: Get a breed by ID
 *     tags: [Breeds]
 *     parameters:
 *       - in: path
 *         name: breedId
 *         required: true
 *         schema:
 *           type: string
 *         description: The breed ID
 *     responses:
 *       200:
 *         description: Breed retrieved successfully
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
 *                   example: Poodle
 *                 description:
 *                   type: string
 *                   example: Intelligent and active dog
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Breed not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update a breed by ID
 *     tags: [Breeds]
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *     parameters:
 *       - in: path
 *         name: breedId
 *         required: true
 *         schema:
 *           type: string
 *         description: The breed ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Labrador Retriever
 *               description:
 *                 type: string
 *                 example: Kind, outgoing, and even-tempered breed
 *     responses:
 *       200:
 *         description: Breed updated successfully
 *       400:
 *         description: Name and description are required or breed not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a breed by ID
 *     tags: [Breeds]
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *     parameters:
 *       - in: path
 *         name: breedId
 *         required: true
 *         schema:
 *           type: string
 *         description: The breed ID
 *     responses:
 *       200:
 *         description: Breed deleted successfully
 *       400:
 *         description: Breed not found
 *       500:
 *         description: Internal server error
 */

breedRoutes.get("/", getAllBreeds);
breedRoutes.get("/:breedId", getBreedById);
breedRoutes.post("/", authMiddleware, csrfMiddleware, isAdmin, createdBreed);
breedRoutes.put(
  "/:breedId",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  updateBreed
);
breedRoutes.delete(
  "/:breedId",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  deleteBreedById
);

export default breedRoutes;
