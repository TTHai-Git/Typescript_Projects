import Route from "express";
import {
  createNotification,
  getNotifications,
  markANotificationAsRead,
} from "../controllers/notification.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { csrfMiddleware } from "../middleware/csrf.js";

const notificationRoutes = Route();

notificationRoutes.get("/", authMiddleware, getNotifications);
// notificationRoutes.get("/", getNotifications);
notificationRoutes.post("/", authMiddleware, isAdmin, createNotification);
// notificationRoutes.post("/", createNotification);
notificationRoutes.patch(
  "/:notificationId/update",
  authMiddleware,
  csrfMiddleware,
  markANotificationAsRead
);
// notificationRoutes.patch(
//   "/:notificationId/update",
//   // authMiddleware,
//   // csrfMiddleware,
//   markANotificationAsRead
// );

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for managing user notifications
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
 * /v1/notifications:
 *   get:
 *     summary: Get notifications for a user
 *     description: Retrieve all notifications of a user, paginated and sorted by creation date.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose notifications to fetch
 *         example: "652e0a2eaa8f3c402f1a1c9f"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: perPage
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of notifications per page
 *     responses:
 *       200:
 *         description: Successfully retrieved user notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 total:
 *                   type: integer
 *                   example: 15
 *       400:
 *         description: Missing userId or invalid query parameters
 *         content:
 *           application/json:
 *             example:
 *               error: "userId is required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

/**
 * @swagger
 * /v1/notifications:
 *   post:
 *     summary: Create a notification
 *     description: Create a new notification (admin only).
 *     tags: [Notifications]
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
 *               - title
 *               - message
 *             properties:
 *               user:
 *                 type: string
 *                 example: "652e0a2eaa8f3c402f1a1c9f"
 *               title:
 *                 type: string
 *                 example: "Your order has been shipped"
 *               message:
 *                 type: string
 *                 example: "Order #1234 has been shipped and will arrive soon."
 *               isRead:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doc:
 *                   $ref: '#/components/schemas/Notification'
 *                 message:
 *                   type: string
 *                   example: Notification created successfully
 *       400:
 *         description: Invalid request body or missing fields
 *         content:
 *           application/json:
 *             example:
 *               error: "Validation failed: user is required"
 *       401:
 *         description: Unauthorized (Admin required)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /v1/notifications/{notificationId}/update:
 *   patch:
 *     summary: Mark a notification as read
 *     description: Marks a specific notification as read for a user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *       - csrfAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the notification to mark as read
 *         example: "6530a1e4f1a3a0c3b1e7f3a1"
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification marked as read
 *                 notif:
 *                   $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notification not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Notification not found"
 *       400:
 *         description: Invalid request or already read
 *         content:
 *           application/json:
 *             example:
 *               message: "Notification already marked as read"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6530a1e4f1a3a0c3b1e7f3a1"
 *         user:
 *           type: string
 *           example: "652e0a2eaa8f3c402f1a1c9f"
 *         title:
 *           type: string
 *           example: "Order Delivered"
 *         message:
 *           type: string
 *           example: "Your order #1234 has been delivered successfully."
 *         isRead:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-06T08:45:30.123Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-06T09:00:00.456Z"
 */

export default notificationRoutes;
