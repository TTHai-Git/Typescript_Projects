import { Router } from "express";
import {
  getBestSellingProducts,
  getListOfMostPopularProducts,
  revenueStatistics,
} from "../controllers/stats.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const statsRoutes = Router();
statsRoutes.get("/revenue", authMiddleware, isAdmin, revenueStatistics);
statsRoutes.get(
  "/selling-best-products",
  authMiddleware,
  isAdmin,
  getBestSellingProducts
);
statsRoutes.get(
  "/most-popular-products",
  authMiddleware,
  isAdmin,
  getListOfMostPopularProducts
);

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: Admin analytics and reports
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
 * /v1/admin/stats/revenue:
 *   get:
 *     summary: Get revenue statistics by month
 *     description: >
 *       Returns total revenue and order count per month for a given year (default = current year).
 *       Only accessible to admin users.
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: The year to calculate revenue statistics for.
 *     responses:
 *       200:
 *         description: Revenue statistics successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 year:
 *                   type: integer
 *                   example: 2025
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       index:
 *                         type: integer
 *                         example: 1
 *                       month:
 *                         type: string
 *                         example: "January"
 *                       revenue:
 *                         type: number
 *                         example: 12000000
 *                       orders:
 *                         type: integer
 *                         example: 45
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /v1/admin/stats/selling-best-products:
 *   get:
 *     summary: Get top 10 best-selling products
 *     description: >
 *       Returns a list of products ranked by total revenue (based on paid orders).
 *       Only accessible to admin users.
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Best-selling products successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                     example: "66a5d7b95f19c82f203a9013"
 *                   name:
 *                     type: string
 *                     example: "Premium Dog Food"
 *                   imageUrl:
 *                     type: string
 *                     example: "https://example.com/images/dogfood.jpg"
 *                   totalSold:
 *                     type: integer
 *                     example: 320
 *                   totalRevenue:
 *                     type: number
 *                     example: 12800000
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /v1/admin/stats/most-popular-products:
 *   get:
 *     summary: Get top 10 most popular products
 *     description: >
 *       Returns a list of products ranked by highest average rating and number of comments.
 *       Only accessible to admin users.
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Most popular products successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productName:
 *                     type: string
 *                     example: "Organic Dog Shampoo"
 *                   averageRating:
 *                     type: number
 *                     format: float
 *                     example: 4.8
 *                   totalComments:
 *                     type: integer
 *                     example: 145
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       500:
 *         description: Server error
 */

export default statsRoutes;
