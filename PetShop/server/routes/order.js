import { Router } from "express";
import {
  createOrder,
  getOrdersOfCustomer,
  getOrderDetails,
  updateStatusOfOrder,
  getOrder,
} from "../controllers/order.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { csrfMiddleware } from "../middleware/csrf.js";

const orderRoutes = Router();
orderRoutes.post("/", authMiddleware, csrfMiddleware, createOrder);
orderRoutes.get("/user/:user_id", authMiddleware, getOrdersOfCustomer);
orderRoutes.get("/:orderId/orderDetails/", authMiddleware, getOrderDetails);
orderRoutes.get("/:orderId/", authMiddleware, getOrder);
orderRoutes.put(
  "/:orderId",
  authMiddleware,
  csrfMiddleware,
  updateStatusOfOrder
);

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: API endpoints for managing customer orders
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
 * /v1/order:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order for the authenticated user.
 *     tags: [Order]
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
 *               - user
 *               - totalPrice
 *             properties:
 *               user:
 *                 type: string
 *                 example: "652e5bd19a7e1b6eaa82f112"
 *               totalPrice:
 *                 type: number
 *                 example: 350000
 *               status:
 *                 type: string
 *                 example: "Pending"
 *               shippingAddress:
 *                 type: string
 *                 example: "123 Main St, District 5, HCMC"
 *               note:
 *                 type: string
 *                 example: "Please deliver after 5 PM."
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doc:
 *                   type: object
 *                   description: Created order document
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *       500:
 *         description: Error while creating order
 */

/**
 * @swagger
 * /v1/order/user/{user_id}:
 *   get:
 *     summary: Get all orders of a specific user
 *     description: Retrieve paginated orders belonging to a user, with optional filters and sorting.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, latest, oldest, none]
 *           example: latest
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: "Delivered"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: "670fe4d0912bcd9871f19a02"
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       totalPrice:
 *                         type: number
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 current:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       404:
 *         description: No orders found
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /v1/order/{orderId}/orderDetails:
 *   get:
 *     summary: Get all order details of a specific order
 *     description: Retrieve all products belonging to a given order (paginated).
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Order details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: string
 *                       product:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                           imageUrl:
 *                             type: string
 *                           category:
 *                             type: object
 *                           brand:
 *                             type: object
 *                           vendor:
 *                             type: object
 *                       quantity:
 *                         type: integer
 *                       totalPrice:
 *                         type: number
 *                       note:
 *                         type: string
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       404:
 *         description: No order details found
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /v1/order/{orderId}:
 *   get:
 *     summary: Get a specific order by ID
 *     description: Retrieve an order’s details by its ID.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Order found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 totalPrice:
 *                   type: number
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Order not found
 *       500:
 *         description: Server Error
 *
 *   put:
 *     summary: Update order status
 *     description: Update the current status of a specific order.
 *     tags: [Order]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Delivered"
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to update
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doc:
 *                   type: object
 *                   description: Updated order document
 *                 message:
 *                   type: string
 *                   example: Order status updated successfully
 *       400:
 *         description: Order not found to update status
 *       500:
 *         description: Server Error
 */

export default orderRoutes;
