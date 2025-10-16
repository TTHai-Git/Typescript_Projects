import { Router } from "express";
import { createOrderDetails } from "../controllers/orderdetails.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const orderDetailsRoutes = Router();
orderDetailsRoutes.post(
  "/",
  authMiddleware,
  csrfMiddleware,
  createOrderDetails
);

/**
 * @swagger
 * tags:
 *   name: OrderDetails
 *   description: API for managing order details
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
 * /v1/order-details:
 *   post:
 *     summary: Create multiple order details for an order
 *     description: Create order details for an order after checkout. Requires authentication and CSRF protection.
 *     tags: [OrderDetails]
 *     security:
 *       - bearerAuth: []
 *       - csrfAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: string
 *                       example: "652ddfd25a1f03d54cb77122"
 *                     product:
 *                       type: string
 *                       example: "652e0a2eaa8f3c402f1a1c9f"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 199000
 *                     total:
 *                       type: number
 *                       example: 398000
 *     responses:
 *       201:
 *         description: Successfully created order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order details created successfully
 *                 doc:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6530a1e4f1a3a0c3b1e7f3a1"
 *                       order:
 *                         type: string
 *                       product:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       price:
 *                         type: number
 *                       total:
 *                         type: number
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             example:
 *               message: "Request body must be an array"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Server error"
 */

export default orderDetailsRoutes;
