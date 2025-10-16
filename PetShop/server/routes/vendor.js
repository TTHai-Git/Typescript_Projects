import Router from "express";
import {
  createVendor,
  deleteVendor,
  getVendorById,
  getVendors,
  updateVendor,
} from "../controllers/vendor.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const vendorRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Vendors
 *   description: API endpoints for managing Vendors Of Products
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
 * /v1/vendors:
 *   get:
 *     summary: Retrieve a list of Vendors
 *     tags: [Vendors]
 *     responses:
 *       200:
 *         description: A list of Vendors
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
 *                   address:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *
 *   post:
 *     summary: Create a new Vendor
 *     tags: [Vendors]
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: test Vendor
 *               contactInfo:
 *                 type: string
 *                 example: contactInfo Of Vendor
 *               address:
 *                 type: string
 *                 example: address Of Vendor
 *               email:
 *                 type: string
 *                 example: email Of Vendor
 *               phone:
 *                 type: string
 *                 example: phone Of Vendor
 *     responses:
 *       201:
 *         description: Vendor created successfully
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
 *                   example: vendor Name
 *                 contactInfo:
 *                   type: string
 *                   example: contactInfo Of Vendor
 *               address:
 *                   type: string
 *                   example: address Of Vendor
 *               email:
 *                   type: string
 *                   example: email Of Vendor
 *               phone:
 *                   type: string
 *                   example: phone Of Vendor
 */
vendorRouter.get("/", getVendors);

/**
 * @swagger
 * /v1/vendors/{vendor_id}:
 *   get:
 *     summary: Get Vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - name: vendor_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor details
 *   put:
 *     summary: Update A Vendor
 *     security:
 *       - bearerAuth: []
 *       - csrfToken: []
 *     tags: [Vendors]
 *     parameters:
 *       - name: vendor_id
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
 *                 example: test Vendor
 *               contactInfo:
 *                 type: string
 *                 example: contactInfo Of Vendor
 *               address:
 *                 type: string
 *                 example: address Of Vendor
 *               email:
 *                 type: string
 *                 example: email Of Vendor
 *               phone:
 *                 type: string
 *                 example: phone Of Vendor
 *   delete:
 *     summary: Delete a vendors
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *       - isAdminAuth: []  # Requires adminKey header

 *     tags: [Vendors]
 *     parameters:
 *       - name: vendor_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor deleted successfully
 *       400:
 *         description: Vendor not found
 *       500:
 *         description: Internal server error
 */

vendorRouter.get("/:vendor_id", getVendorById);
vendorRouter.post("/", authMiddleware, csrfMiddleware, isAdmin, createVendor);
vendorRouter.put(
  "/:vendor_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  updateVendor
);
vendorRouter.delete(
  "/:vendor_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  deleteVendor
);

export default vendorRouter;
