import Route from "express";
import {
  createOrUpdateFavorite,
  deleteFavorite,
  getFavoriteProductOfUser,
  getFavoriteProductsList,
} from "../controllers/favorite.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { secureMiddleware } from "../middleware/secureMiddleware.js";

const favoriteRoutes = Route();

favoriteRoutes.post("/", secureMiddleware, createOrUpdateFavorite);
favoriteRoutes.get(
  "/product/:productId/user/:userId",
  authMiddleware,
  getFavoriteProductOfUser
);
favoriteRoutes.get("/user/:userId", getFavoriteProductsList);
favoriteRoutes.delete("/:favoriteId", secureMiddleware, deleteFavorite);

export default favoriteRoutes;
