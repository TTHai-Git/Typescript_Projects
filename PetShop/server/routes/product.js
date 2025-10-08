import Router from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { csrfMiddleware } from "../middleware/csrf.js";

const productRoutes = Router();

productRoutes.get("/", getAllProducts);
productRoutes.get("/:type/:product_id", getProductById);
productRoutes.post("/", authMiddleware, csrfMiddleware, isAdmin, createProduct);
productRoutes.put("/:product_id", authMiddleware, isAdmin, updateProduct);
productRoutes.delete(
  "/:product_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  deleteProduct
);
// productRoutes.put("/update-stock/:product_id", updateStock);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
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
 * /v1/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a paginated list of all products with optional filters and sorting.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of products per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, latest, oldest, az, za, none]
 *         description: Sort products by field
 *     responses:
 *       200:
 *         description: Successfully retrieved product list
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /v1/products/{type}/{product_id}:
 *   get:
 *     summary: Get a specific product by type and ID
 *     description: Retrieve details for a single product, including category, vendor, brand, and rating.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [dog, food, clothes, accessory]
 *         description: The type of product
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Successfully retrieved product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Add a new product to the database. Only admins can perform this action.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []       # Requires JWT authentication
 *       - csrfAuth: []         # If CSRF middleware is active
 *     requestBody:
 *       required: true
 *       description: Product data to create
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - name
 *               - description
 *               - price
 *               - imageUrl
 *               - status
 *               - stock
 *               - category
 *               - brand
 *               - vendor
 *               - rest
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [dog, food, clothes, accessory]
 *               name:
 *                 type: string
 *                 example: "Dog Chew Toy"
 *               description:
 *                 type: string
 *                 example: "Durable rubber toy for dogs of all sizes."
 *               price:
 *                 type: number
 *                 example: 19.99
 *               imageUrl:
 *                 type: string
 *                 example: "https://res.cloudinary.com/myshop/image/upload/dogtoy.png"
 *               status:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *               stock:
 *                 type: number
 *                 default: 0
 *                 example: 50
 *               category:
 *                 type: string
 *                 description: MongoDB ObjectId of the category
 *                 example: "67029a4b3c7fdd12a9d1cbe2"
 *               brand:
 *                 type: string
 *                 description: MongoDB ObjectId of the brand
 *                 example: "67029a513c7fdd12a9d1cbe5"
 *               vendor:
 *                 type: string
 *                 description: MongoDB ObjectId of the vendor
 *                 example: "67029a563c7fdd12a9d1cbe7"
 *               rest:
 *                 type: object
 *                 description: Type-specific fields (e.g., ingredients for food, size for clothes)
 *                 example:
 *                   ingredients: ["chicken", "rice", "vegetables"]
 *                   size: ["M", "L", "XL"]
 *                   age: 2
 *                   breed: "67029a6b3c7fdd12a9d1cbea"
 *                   color: ["red", "blue"]
 *                   material: ["cotton", "polyester"]
 *                   season: ["summer", "winter", "all-season"]
 *                   dimensions: "10x5x3 inches"
 *                   weight: "1.5 lbs"
 *                   height: 12
 *                   suitableFor: ["small dogs", "medium dogs"]
 *                   usage: "grooming"
 *                   expirationDate: "2025-12-31"
 *                   recommendedFor: ["puppy", "adult cat"]
 *
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad Request — invalid or missing fields
 *         content:
 *           application/json:
 *             example:
 *               message: "Product validation failed"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Failed to create product"
 */

/**
 * @swagger
 * /products/{product_id}:
 *   put:
 *     summary: Update an existing product
 *     description: Update any product field by its ID. Only admins can perform this action.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *       - csrfAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       description: Fields to update (you can send one or more)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Dog Chew Toy"
 *               description:
 *                 type: string
 *                 example: "Now made from eco-friendly materials."
 *               price:
 *                 type: number
 *                 example: 21.99
 *               imageUrl:
 *                 type: string
 *                 example: "https://res.cloudinary.com/myshop/image/upload/dogtoy_updated.png"
 *               status:
 *                 type: boolean
 *                 example: false
 *               stock:
 *                 type: number
 *                 example: 80
 *               category:
 *                 type: string
 *                 example: "67029a4b3c7fdd12a9d1cbe2"
 *               brand:
 *                 type: string
 *                 example: "67029a513c7fdd12a9d1cbe5"
 *               vendor:
 *                 type: string
 *                 example: "67029a563c7fdd12a9d1cbe7"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad Request — update data is missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               message: "Update data is required"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Product not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Something went wrong while updating the product"
 */

/**
 * @swagger
 * /v1/products/{product_id}:
 *   delete:
 *     summary: Delete a product by ID
 *     description: Permanently delete a product from the database. Requires admin privileges and CSRF token.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

export default productRoutes;
