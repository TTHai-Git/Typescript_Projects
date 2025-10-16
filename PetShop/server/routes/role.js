import { Router } from "express";
import {
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  updateRole,
} from "../controllers/role.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const roleRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API endpoints for managing Roles Of Users
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
 * /v1/roles:
 *   get:
 *     summary: Retrieve a list of Roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: A list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *
 *   post:
 *     summary: Create a new Role
 *     tags: [Roles]
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
 *                 example: Test Role
 *     responses:
 *       201:
 *         description: Role created successfully
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
 *                   example: Admin
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */

roleRoutes.get("/", getRoles);
/**
 * @swagger
 * /v1/roles/{role_id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     parameters:
 *       - name: role_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role details
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *       - isAdminAuth: []  # Requires adminKey header

 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The role ID
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
 *                 example: Updated Role Name
 *     responses:
 *       200:
 *         description:  updated successfully
 *       400:
 *         description: Name is required or Role not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a Role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []   # Requires JWT cookie
 *       - csrfAuth: []     # Requires CSRF header
 *       - isAdminAuth: []  # Requires adminKey header

 *     parameters:
 *       - in: path
 *         name: RoleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       400:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
roleRoutes.get("/:role_id", getRoleById);
roleRoutes.post("/", authMiddleware, csrfMiddleware, isAdmin, createRole);
roleRoutes.put(
  "/:role_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  updateRole
);
roleRoutes.delete(
  "/:role_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  deleteRole
);

export default roleRoutes;
