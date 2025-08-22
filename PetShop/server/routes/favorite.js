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

export default favoriteRoutes;
