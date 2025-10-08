import { Router } from "express";
import {
  authMe,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/auth.js";
import { verifyEmail } from "../controllers/verifyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { csrfMiddleware } from "../middleware/csrf.js";
const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", authMiddleware, authMe);
authRoutes.post("/refresh", authMiddleware, csrfMiddleware, refreshAccessToken);
authRoutes.post("/verify-email", verifyEmail);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user account management
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
 * /v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Create a new user, hash their password, and send an email verification link.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - avatar
 *               - phone
 *               - address
 *               - role
 *               - isVerified
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPassword123
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               address:
 *                 type: string
 *                 example: "123 Main St, District 1, HCMC"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *               role:
 *                 type: string
 *                 example: "abc1687893"
 *               isVerified:
 *                 type: string
 *                 example: "abc1687893"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User registered successfully. Verification email has sent to your email.
 *               doc:
 *                 _id: 60d0fe4f5311236168a109ca
 *                 username: johndoe
 *                 email: johndoe@example.com
 *                 phone: "0987654321"
 *                 address: "123 Main St, District 1, HCMC"
 *                 isVerified: false
 *       400:
 *         description: Invalid email format
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid email format
 *       200:
 *         description: Duplicate username, phone, or email
 *         content:
 *           application/json:
 *             examples:
 *               usernameExists:
 *                 value:
 *                   message: User has already exists
 *               phoneExists:
 *                 value:
 *                   message: This phone has already exists
 *               emailExists:
 *                 value:
 *                   message: This email has already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Server error
 */

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     description: Authenticate user by username, email, or phone, and set HttpOnly access/refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               _id: 60d0fe4f5311236168a109ca
 *               username: johndoe
 *               name: John Doe
 *               email: johndoe@example.com
 *               phone: "0987654321"
 *               address: "123 Main St, District 1, HCMC"
 *               avatar: "https://example.com/avatar.jpg"
 *               isVerified: true
 *               role:
 *                 id: 60cf6c4f5311236168a109cb
 *                 name: User
 *                 _v: 0
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             examples:
 *               invalidUser:
 *                 value:
 *                   message: Invalid Username/EmaiL/Phone
 *               invalidPassword:
 *                 value:
 *                   message: Invalid password
 *       403:
 *         description: Email not verified
 *         content:
 *           application/json:
 *             example:
 *               message: Please verify your email before logging in
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Server error
 */

/**
 * @swagger
 * /v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     description: Clear access, refresh, and CSRF cookies to logout the user.
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             example:
 *               message: Logged out
 */

/**
 * @swagger
 * /v1/auth/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Auth]
 *     security:
 *        - bearerAuth: []
 *     description: Return authenticated user data (excluding password).
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             example:
 *               _id: 60d0fe4f5311236168a109ca
 *               username: johndoe
 *               name: John Doe
 *               email: johndoe@example.com
 *               phone: "0987654321"
 *               address: "123 Main St, District 1, HCMC"
 *               avatar: "https://example.com/avatar.jpg"
 *               isVerified: true
 *               role:
 *                 name: User
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Server error
 */

/**
 * @swagger
 * /v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security:
 *        - bearerAuth: []
 *     description: Generate a new access token using the valid refresh token stored in cookies.
 *     responses:
 *       200:
 *         description: New access token created
 *         content:
 *           application/json:
 *             example:
 *               message: Access token refreshed
 *               accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Refresh token missing
 *         content:
 *           application/json:
 *             example:
 *               message: Refresh token missing
 *       403:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid refresh token
 */

export default authRoutes;
