import Brand from "../models/brand.js";
import Category from "../models/category.js";
import Favorite from "../models/favorite.js";
import Product from "../models/product.js";
import Vendor from "../models/vendor.js";
import { clearCacheByKeyword, getOrSetCachedData } from "./redis.js";

// ---------------------------------------------------------
// Utility: Clear all Favorite-related cache for a user/product
// ---------------------------------------------------------
const clearFavoriteCache = async (userId, productId) => {
  await clearCacheByKeyword(`GET:/v1/favorites/user/${userId}`);
  await clearCacheByKeyword(`GET:/v1/favorites/product/${productId}`);
  await clearCacheByKeyword(`GET:/v1/products/${productId}`); // Product detail cached data
};

// ---------------------------------------------------------
// Create or Delete a Favorite (Toggle Mode)
// ---------------------------------------------------------
export const createOrUpdateFavorite = async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({
      message: "Request body must contain userId and productId",
    });
  }

  try {
    const existsFavorite = await Favorite.findOne({
      user: userId,
      product: productId,
    });

    // ---------------------------------------------------------
    // Create Favorite
    // ---------------------------------------------------------
    if (!existsFavorite) {
      await Favorite.create({ user: userId, product: productId });

      await clearFavoriteCache(userId, productId);

      return res.status(201).json({
        doc: true,
        message: "Add Product To Favorite List Success",
      });
    }

    // ---------------------------------------------------------
    // Delete Favorite (toggle)
    // ---------------------------------------------------------
    await Favorite.findByIdAndDelete(existsFavorite._id);

    await clearFavoriteCache(userId, productId);

    return res.status(200).json({
      doc: false,
      message: "Remove Product From Favorite List Success",
    });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  } finally {
    await clearFavoriteCache(userId, productId);
  }
};

// ---------------------------------------------------------
// Check if product is favorite for user
// ---------------------------------------------------------
export const getFavoriteProductOfUser = async (req, res) => {
  const { productId, userId } = req.params;

  if (!userId || !productId) {
    return res.status(400).json({
      message: "Request body must contain userId and productId",
    });
  }

  const cacheKey = `GET:/v1/favorites/product/${productId}/user/${userId}`;

  try {
    const isFavorite = await getOrSetCachedData(cacheKey, async () => {
      const exists = await Favorite.exists({
        product: productId,
        user: userId,
      });
      return Boolean(exists);
    });

    return res.status(200).json({ isFavorite });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// ---------------------------------------------------------
// Paginated + Filtered + Sorted Favorite Products List
// ---------------------------------------------------------
export const getFavoriteProductsList = async (req, res) => {
  const { userId } = req.params;
  const perPage = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;

  const { category, search, sort } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Request must include userId" });
  }

  try {
    const cacheKey = `GET:/v1/favorites/user/${userId}?page=${page}&limit=${perPage}&category=${
      category || "all"
    }&search=${search || "none"}&sort=${sort || "none"}`;

    const result = await getOrSetCachedData(cacheKey, async () => {
      // ---------------------------------------------------------
      // Build product search filter
      // ---------------------------------------------------------
      const productFilter = {};

      if (category) productFilter.category = category;

      if (search) {
        productFilter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      const matchedProductIds = await Product.find(productFilter).distinct(
        "_id"
      );

      // ---------------------------------------------------------
      // Sorting Favorites by Date
      // ---------------------------------------------------------
      const sortOption =
        sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

      // ---------------------------------------------------------
      // Find Favorites (paginated)
      // ---------------------------------------------------------
      const favorites = await Favorite.find({
        user: userId,
        product: { $in: matchedProductIds },
      })
        .sort(sortOption)
        .skip(perPage * (page - 1))
        .limit(perPage);

      if (favorites.length === 0) {
        return { results: [], current: page, pages: 0, total: 0 };
      }

      // ---------------------------------------------------------
      // Load product details in bulk
      // ---------------------------------------------------------
      const productIds = favorites.map((f) => f.product);
      const products = await Product.find({ _id: { $in: productIds } });

      // Map for quick access
      const map = new Map(products.map((p) => [p._id.toString(), p]));

      const combined = [];

      for (const fav of favorites) {
        const product = map.get(fav.product.toString());
        if (!product) continue;

        const [brand, vendor, categoryObj] = await Promise.all([
          Brand.findById(product.brand),
          Vendor.findById(product.vendor),
          Category.findById(product.category),
        ]);

        combined.push({
          _id: fav._id,
          userId,
          createdAt: fav.createdAt,
          updatedAt: fav.updatedAt,
          product: {
            ...product.toObject(),
            brand,
            vendor,
            category: categoryObj,
          },
        });
      }

      // ---------------------------------------------------------
      // Client-side sorting
      // ---------------------------------------------------------
      if (sort === "price_asc")
        combined.sort((a, b) => a.product.price - b.product.price);
      if (sort === "price_desc")
        combined.sort((a, b) => b.product.price - a.product.price);
      if (sort === "az")
        combined.sort((a, b) => a.product.name.localeCompare(b.product.name));
      if (sort === "za")
        combined.sort((a, b) => b.product.name.localeCompare(a.product.name));

      // Count total
      const total = await Favorite.countDocuments({
        user: userId,
        product: { $in: matchedProductIds },
      });

      return {
        results: combined,
        current: page,
        pages: Math.ceil(total / perPage),
        total,
      };
    });

    if (!result.results?.length) {
      return res.status(200).json({ message: "No Favorite Product Found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error fetching favorite products:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------
// Delete Favorite Explicitly
// ---------------------------------------------------------
export const deleteFavorite = async (req, res) => {
  const { favoriteId } = req.params;
  const favorite = await Favorite.findById(favoriteId);

  try {
    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    // Correct authorization
    if (req.user.id.toString() !== favorite.user.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this favorite" });
    }

    await favorite.deleteOne();
    await clearFavoriteCache(favorite.user, favorite.product);

    return res.status(204).send();
  } catch (error) {
    console.error("❌ Error deleting Favorite:", error);
    return res.status(500).json({ message: error.message });
  } finally {
    await clearFavoriteCache(favorite.user, favorite.product);
  }
};

// ---------------------------------------------------------
// Count Favorites For a Product
// ---------------------------------------------------------
export const countFavoriteOfProduct = async (productId) => {
  return await Favorite.countDocuments({ product: productId });
};
