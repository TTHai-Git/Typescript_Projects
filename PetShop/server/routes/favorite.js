import Route from "express";
import {
  createOrUpdateFavorite,
  deleteFavorite,
  getFavoriteProductOfUser,
  getFavoriteProductsList,
} from "../controllers/favorite.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { csrfMiddleware } from "../middleware/csrf.js";

const favoriteRoutes = Route();

favoriteRoutes.post(
  "/",
  authMiddleware,
  csrfMiddleware,
  createOrUpdateFavorite
);
favoriteRoutes.get(
  "/product/:productId/user/:userId",
  authMiddleware,
  getFavoriteProductOfUser
);
favoriteRoutes.get("/user/:userId", getFavoriteProductsList);
favoriteRoutes.delete(
  "/:favoriteId",
  authMiddleware,
  csrfMiddleware,
  deleteFavorite
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         product:
 *           type: string
 *         isFavorite:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     FavoriteProduct:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         isFavorite:
 *           type: boolean
 *         product:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             description:
 *               type: string
 *             price:
 *               type: number
 *             imageUrl:
 *               type: string
 *             status:
 *               type: string
 *             brand:
 *               type: object
 *               nullable: true
 *             vendor:
 *               type: object
 *               nullable: true
 *             category:
 *               type: object
 *               nullable: true
 *
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
export default favoriteRoutes;
