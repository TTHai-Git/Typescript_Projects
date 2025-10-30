import Brand from "../models/brand.js";
import Category from "../models/category.js";
import Favorite from "../models/favorite.js";
import Product from "../models/product.js";
import Vendor from "../models/vendor.js";
import { clearCacheByKeyword, getOrSetCachedData } from "./redis.js";

export const createOrUpdateFavorite = async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "Request body must userId and productId" });
  }
  const existsFavorite = await Favorite.findOne({
    user: userId,
    product: productId,
  });

  //clear cache data of favorites and products
  await clearCacheByKeyword("favorites");
  // await clearCacheByKeyword("products");

  if (!existsFavorite) {
    const newFavorite = await Favorite.create({
      user: userId,
      product: productId,
    });
    return res.status(201).json({
      doc: true,
      message: "Add Product To Favorite List Success",
    });
  } else {
    const deleteFavorite = await Favorite.findByIdAndDelete(existsFavorite._id);
    return res.status(200).json({
      doc: false,
      message: "Remove Product To Favorite List Success",
    });
  }
};

export const getFavoriteProductOfUser = async (req, res) => {
  const { productId, userId } = req.params;
  const cacheKey = `GET:/v1/favorites/product/${productId}/user/${userId}`;
  try {
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "Request body must userId and productId" });
    }

    const isFavorite = await getOrSetCachedData(cacheKey, async () => {
      const exists = await Favorite.exists({
        product: productId,
        user: userId,
      });
      return Boolean(exists);
    });
    return res.status(200).json({ isFavorite: isFavorite });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error} ` });
  }
};

export const getFavoriteProductsList = async (req, res) => {
  const { userId } = req.params;
  const perPage = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;
  const { category, search, sort } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json({ message: "Request body must include userId" });
  }

  try {
    // 🧩 Step 1: Build unique cache key
    const cacheKey = `GET:/v1/favorites/user/${userId}?page=${page}&limit=${perPage}&category=${
      category || "all"
    }&search=${search || "none"}&sort=${sort || "none"}`;

    // 🧠 Step 2: Wrap DB logic inside caching function
    const result = await getOrSetCachedData(cacheKey, async () => {
      const productFilter = {};
      if (category) productFilter.category = category;
      if (search) {
        productFilter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Step 3: Find matching product IDs
      const matchedProducts = await Product.find(productFilter).select("_id");
      const matchedProductIds = matchedProducts.map((p) => p._id);

      // Step 4: Sorting logic for favorites
      let favoriteSort = { createdAt: -1 }; // default newest
      if (sort === "latest") favoriteSort = { createdAt: -1 };
      else if (sort === "oldest") favoriteSort = { createdAt: 1 };

      // Step 5: Find favorites for this user
      const favorites = await Favorite.find({
        user: userId,
        isFavorite: true,
        product: { $in: matchedProductIds },
      })
        .sort(favoriteSort)
        .skip(perPage * (page - 1))
        .limit(perPage);

      if (favorites.length === 0) {
        return { results: [], current: page, pages: 0, total: 0 };
      }

      // Step 6: Load related products
      const productIds = favorites.map((fav) => fav.product);
      const products = await Product.find({ _id: { $in: productIds } });
      const productsMap = new Map(
        products.map((prod) => [prod._id.toString(), prod])
      );

      // Step 7: Compose combined data
      const combinedData = [];
      for (const favorite of favorites) {
        const product = productsMap.get(favorite.product.toString());
        if (!product) continue;

        const [brand, vendor, categoryObj] = await Promise.all([
          Brand.findById(product.brand),
          Vendor.findById(product.vendor),
          Category.findById(product.category),
        ]);

        combinedData.push({
          _id: favorite._id,
          userId: favorite.user,
          isFavorite: favorite.isFavorite,
          createdAt: favorite.createdAt,
          updatedAt: favorite.updatedAt,
          product: {
            _id: product._id,
            type: product.__t,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            status: product.status,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            category: categoryObj,
            vendor,
            brand,
          },
        });
      }

      // Step 8: Optional in-memory sorting
      if (sort === "price_asc")
        combinedData.sort((a, b) => a.product.price - b.product.price);
      else if (sort === "price_desc")
        combinedData.sort((a, b) => b.product.price - a.product.price);
      else if (sort === "az")
        combinedData.sort((a, b) =>
          a.product.name.localeCompare(b.product.name)
        );
      else if (sort === "za")
        combinedData.sort((a, b) =>
          b.product.name.localeCompare(a.product.name)
        );

      // Step 9: Count total favorites
      const totalFavorites = await Favorite.countDocuments({
        user: userId,
        isFavorite: true,
        product: { $in: matchedProductIds },
      });

      return {
        results: combinedData,
        current: page,
        pages: Math.ceil(totalFavorites / perPage),
        total: totalFavorites,
      };
    });

    // 🧾 Step 10: Return cached or fresh data
    if (!result.results || result.results.length === 0) {
      return res.status(200).json({ message: "No Favorite Product Found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error fetching favorite products:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;
    const favorite = await Favorite.findById(favoriteId);
    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found to delete" });
    }
    if (!req.user._id == favorite.user) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this favorite" });
    }
    await favorite.deleteOne();

    // clear cache data of favorites and products
    await clearCacheByKeyword("favorites");

    res.status(204).send();
  } catch (error) {
    console.error("Error delete Favorite:", error);
    res.status(500).json({ message: "server error", error });
  }
};

export const countFavoriteOfProduct = async (productId) => {
  const countFavoriteOfProduct = await Favorite.find({
    product: productId,
    isFavorite: true,
  }).countDocuments();
  // console.log("countFavoriteOfProduct", countFavoriteOfProduct)
  return countFavoriteOfProduct;
};
