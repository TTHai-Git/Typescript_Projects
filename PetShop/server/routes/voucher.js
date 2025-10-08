import { Router } from "express";
import {
  createManyVouchers,
  createVoucher,
  deleteVoucher,
  getAvailableVouchersForOrders,
  getAvailableVouchersForShipment,
  getVoucher,
  updateVoucher,
  updateVoucherUsageForUser,
} from "../controllers/voucher.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const voucherRouter = Router();

voucherRouter.get("/:voucherId", getVoucher);
voucherRouter.get("/available/for-orders", getAvailableVouchersForOrders);
voucherRouter.get("/available/for-shipments", getAvailableVouchersForShipment);

voucherRouter.post("/", authMiddleware, csrfMiddleware, isAdmin, createVoucher);
// voucherRouter.post("/", createVoucher);
// voucherRouter.post("/create-many", createManyVouchers);

voucherRouter.put(
  "/:voucherId",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  updateVoucher
);
// voucherRouter.put("/:voucherId", updateVoucher);
voucherRouter.patch(
  "/:voucherId/usage",
  authMiddleware,
  csrfMiddleware,
  updateVoucherUsageForUser
);

voucherRouter.delete(
  "/:voucherId",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  deleteVoucher
);
// voucherRouter.delete("/:voucherId", deleteVoucher);

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
 * tags:
 *   name: Vouchers
 *   description: Manage vouchers for orders and shipments
 */

/**
 * @swagger
 * /v1/vouchers/{voucherId}:
 *   get:
 *     summary: Get voucher by ID
 *     tags: [Vouchers]
 *     parameters:
 *       - in: path
 *         name: voucherId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the voucher
 *     responses:
 *       200:
 *         description: Voucher retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: 66f3e50b0cd14d08b8c7731a
 *               code: SAVE10
 *               discount: 10
 *               type: Order
 *               minimumPrice: 100000
 *               expiryDate: 2025-12-31T23:59:59.000Z
 *               isActive: true
 *               usageCount: 0
 *               maxUsage: 50
 *       404:
 *         description: Voucher not found
 *         content:
 *           application/json:
 *             example:
 *               message: voucher not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */

/**
 * @swagger
 * /v1/vouchers/available/for-orders:
 *   get:
 *     summary: Get available vouchers for orders
 *     tags: [Vouchers]
 *     description: Returns all active vouchers that apply to order discounts based on total cart amount.
 *     parameters:
 *       - in: query
 *         name: totalOfCart
 *         required: true
 *         schema:
 *           type: number
 *         description: Total amount of the user's cart
 *         example: 500000
 *     responses:
 *       200:
 *         description: List of applicable order vouchers
 *         content:
 *           application/json:
 *             example:
 *               - _id: 66f3e50b0cd14d08b8c7731a
 *                 code: ORDER15
 *                 discount: 15
 *                 minimumPrice: 300000
 *                 expiryDate: 2025-12-31T23:59:59.000Z
 *                 type: Order
 *                 isActive: true
 *                 usageCount: 10
 *                 maxUsage: 100
 *       400:
 *         description: Invalid totalOfCart parameter
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid tempTotal
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Server error
 */

/**
 * @swagger
 * /v1/vouchers/available/for-shipments:
 *   get:
 *     summary: Get available vouchers for shipments
 *     tags: [Vouchers]
 *     description: Returns all active vouchers that apply to shipment fee discounts.
 *     parameters:
 *       - in: query
 *         name: shipmentFee
 *         required: true
 *         schema:
 *           type: number
 *         description: Shipment fee to compare with minimumPrice of voucher
 *         example: 40000
 *     responses:
 *       200:
 *         description: List of applicable shipment vouchers
 *         content:
 *           application/json:
 *             example:
 *               - _id: 66f3e50b0cd14d08b8c7731a
 *                 code: SHIPFREE
 *                 discount: 20000
 *                 type: Shipment
 *                 minimumPrice: 30000
 *                 expiryDate: 2025-11-30T23:59:59.000Z
 *                 isActive: true
 *                 usageCount: 0
 *                 maxUsage: 100
 *       400:
 *         description: Invalid shipmentFee parameter
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid shipmentFee
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Server error
 */

/**
 * @swagger
 * /v1/vouchers:
 *   post:
 *     summary: Create a new voucher
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *     description: Create a new voucher (Admin only). Expiry date should be in `DD/MM/YYYY - HH:mm:ss` format.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discount
 *               - type
 *               - maxUsage
 *               - expiryDate
 *             properties:
 *               code:
 *                 type: string
 *                 example: ORDER10
 *               discount:
 *                 type: number
 *                 example: 10
 *               type:
 *                 type: string
 *                 enum: [Order, Shipment]
 *                 example: Order
 *               minimumPrice:
 *                 type: number
 *                 example: 200000
 *               maxUsage:
 *                 type: number
 *                 example: 50
 *               expiryDate:
 *                 type: string
 *                 example: "10/12/2025 - 23:59:59"
 *     responses:
 *       201:
 *         description: Voucher created successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: 66f3e50b0cd14d08b8c7731a
 *               code: ORDER10
 *               discount: 10
 *               minimumPrice: 200000
 *               type: Order
 *               expiryDate: 2025-12-10T23:59:59.000Z
 *               isActive: true
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Server error
 */

/**
 * @swagger
 * /v1/vouchers/{voucherId}:
 *   put:
 *     summary: Update a voucher by ID
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *     description: Update voucher details. Automatically deactivates if expired or reached max usage.
 *     parameters:
 *       - in: path
 *         name: voucherId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the voucher to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discount:
 *                 type: number
 *                 example: 20
 *               minimumPrice:
 *                 type: number
 *                 example: 300000
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Voucher updated successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: 66f3e50b0cd14d08b8c7731a
 *               code: ORDER10
 *               discount: 20
 *               minimumPrice: 300000
 *               isActive: true
 *       404:
 *         description: Voucher not found
 *         content:
 *           application/json:
 *             example:
 *               message: Voucher not found to update
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */

/**
 * @swagger
 * /v1/vouchers/{voucherId}/usage:
 *   patch:
 *     summary: Update voucher usage for user
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *     description: Increments the usage count of a voucher and deactivates it if max usage is reached or expired.
 *     parameters:
 *       - in: path
 *         name: voucherId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the voucher
 *     responses:
 *       200:
 *         description: Voucher usage updated successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: 66f3e50b0cd14d08b8c7731a
 *               code: ORDER10
 *               usageCount: 1
 *               isActive: true
 *       400:
 *         description: Voucher is no longer valid
 *         content:
 *           application/json:
 *             example:
 *               message: Voucher is no longer valid
 *       404:
 *         description: Voucher not found
 *         content:
 *           application/json:
 *             example:
 *               message: Voucher not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */

/**
 * @swagger
 * /v1/vouchers/{voucherId}:
 *   delete:
 *     summary: Delete voucher by ID
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *     description: Delete an existing voucher (Admin only).
 *     parameters:
 *       - in: path
 *         name: voucherId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the voucher
 *     responses:
 *       204:
 *         description: Voucher deleted successfully
 *       404:
 *         description: Voucher not found
 *         content:
 *           application/json:
 *             example:
 *               message: Voucher not found to delete
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */

export default voucherRouter;
