import { Router } from "express";
import {
  caculateShipmentFee,
  createShipment,
  getShipmentOfOrder,
} from "../controllers/shipment.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { csrfMiddleware } from "../middleware/csrf.js";

const shipmentRoutes = Router();
shipmentRoutes.get("/order/:orderId", authMiddleware, getShipmentOfOrder);
shipmentRoutes.post("/", authMiddleware, csrfMiddleware, createShipment);
shipmentRoutes.post(
  "/calculate-fee",
  authMiddleware,
  csrfMiddleware,
  caculateShipmentFee
);

/**
 * @swagger
 * tags:
 *   name: Shipment
 *   description: Shipment management APIs
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
 * /v1/shipment/order/{orderId}:
 *   get:
 *     summary: Get shipment information of a specific order
 *     description: Retrieve the shipment details associated with a given order ID.
 *     tags: [Shipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to fetch shipment info
 *     responses:
 *       200:
 *         description: Shipment found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 order:
 *                   type: string
 *                 address:
 *                   type: string
 *                 method:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: "Pending"
 *       400:
 *         description: Shipment not found for Order
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /v1/shipment:
 *   post:
 *     summary: Create a new shipment
 *     description: Creates delivery information for an order. Requires authentication and CSRF token.
 *     tags: [Shipment]
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
 *               - address
 *               - method
 *             properties:
 *               order:
 *                 type: string
 *                 example: "652e5bd19a7e1b6eaa82f112"
 *               address:
 *                 type: string
 *                 example: "123 Main St, District 1, HCMC"
 *               method:
 *                 type: string
 *                 enum: [Delivery, Pickup]
 *                 example: "Delivery"
 *               shippingFee:
 *                 type: number
 *                 example: 20000
 *               expectedDeliveryDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-10"
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Delivery information has been successfully created! Proceed to payment.
 *                 doc:
 *                   type: object
 *                   description: Created shipment document
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /v1/shipment/calculate-fee:
 *   post:
 *     summary: Calculate shipment fee
 *     description: Calculates the shipping fee based on distance, delivery method, and discount.
 *     tags: [Shipment]
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
 *               - distance
 *               - method
 *             properties:
 *               distance:
 *                 type: number
 *                 example: 5
 *               method:
 *                 type: string
 *                 enum: [Delivery, Pickup]
 *                 example: "Delivery"
 *               discount:
 *                 type: number
 *                 example: 10
 *     responses:
 *       200:
 *         description: Shipping fee calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shippingFee:
 *                   type: number
 *                   example: 35000
 *       400:
 *         description: Invalid distance value
 *       500:
 *         description: Internal Server Error
 */

export default shipmentRoutes;
