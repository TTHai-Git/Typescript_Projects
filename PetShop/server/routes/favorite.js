import Route from "express";
import {
  createOrUpdateFavorite,
  deleteFavorite,
  getFavoriteProductOfUser,
  getFavoriteProductsList,
} from "../controllers/favorite.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const favoriteRoutes = Route();

favoriteRoutes.post("/", authMiddleware, createOrUpdateFavorite);
favoriteRoutes.get(
  "/product/:productId/user/:userId",
  authMiddleware,
  getFavoriteProductOfUser
);
favoriteRoutes.get("/user/:userId", getFavoriteProductsList);
favoriteRoutes.delete("/:favoriteId", authMiddleware, deleteFavorite);

export default favoriteRoutes;
