import Router from "express";
import {
  createPaymentForOrder,
  getPaymentDetailsForOrder,
  getPaymentForOrder,
} from "../controllers/payment.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const paymentRoutes = Router();
paymentRoutes.post("/", authMiddleware, csrfMiddleware, createPaymentForOrder);
paymentRoutes.get("/:paymentId", getPaymentDetailsForOrder);
paymentRoutes.get("/order/:orderId", getPaymentForOrder);

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API for handling order payments
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
 * /v1/payments:
 *   post:
 *     summary: Create a payment for an order
 *     description: Create a payment record for a specific order after shipment is created. Also automatically updates product stock.
 *     tags: [Payments]
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
 *               - order
 *               - method
 *               - provider
 *               - amount
 *               - status
 *             properties:
 *               order:
 *                 type: string
 *                 example: "652e0a2eaa8f3c402f1a1c9f"
 *               method:
 *                 type: string
 *                 example: "VNPay"
 *               provider:
 *                 type: string
 *                 example: "VNPay Gateway"
 *               amount:
 *                 type: number
 *                 example: 399000
 *               status:
 *                 type: string
 *                 enum: [PENDING, PAID, FAILED]
 *                 example: "PAID"
 *               transactionId:
 *                 type: string
 *                 example: "VNP123456789"
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment created successfully
 *                 doc:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6530a1e4f1a3a0c3b1e7f3a1"
 *                     order:
 *                       type: string
 *                       example: "652e0a2eaa8f3c402f1a1c9f"
 *                     method:
 *                       type: string
 *                       example: "VNPay"
 *                     provider:
 *                       type: string
 *                       example: "VNPay Gateway"
 *                     amount:
 *                       type: number
 *                       example: 399000
 *                     status:
 *                       type: string
 *                       example: "PAID"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-06T08:45:30.123Z"
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             example:
 *               message: "Bad request"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

/**
 * @swagger
 * /v1/payments/order/{orderId}:
 *   get:
 *     summary: Get payment by order ID
 *     description: Retrieve the payment associated with a specific order.
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *         example: "652e0a2eaa8f3c402f1a1c9f"
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6530a1e4f1a3a0c3b1e7f3a1"
 *                 method:
 *                   type: string
 *                   example: "VNPay"
 *                 provider:
 *                   type: string
 *                   example: "VNPay Gateway"
 *                 status:
 *                   type: string
 *                   example: "PAID"
 *                 order:
 *                   type: string
 *                   example: "652e0a2eaa8f3c402f1a1c9f"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-06T08:45:30.123Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-06T09:00:00.456Z"
 *       400:
 *         description: Payment not found for the given order
 *         content:
 *           application/json:
 *             example:
 *               message: "Payment not found for Order"
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /v1/payments/{paymentId}:
 *   get:
 *     summary: Get payment details by payment ID
 *     description: Retrieve full details of a specific payment.
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment
 *         example: "6530a1e4f1a3a0c3b1e7f3a1"
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6530a1e4f1a3a0c3b1e7f3a1"
 *                 order:
 *                   type: string
 *                   example: "652e0a2eaa8f3c402f1a1c9f"
 *                 method:
 *                   type: string
 *                   example: "VNPay"
 *                 provider:
 *                   type: string
 *                   example: "VNPay Gateway"
 *                 amount:
 *                   type: number
 *                   example: 399000
 *                 status:
 *                   type: string
 *                   example: "PAID"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-06T08:45:30.123Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-06T09:00:00.456Z"
 *       400:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Payment not found for Order"
 *       500:
 *         description: Internal Server Error
 */

export default paymentRoutes;
