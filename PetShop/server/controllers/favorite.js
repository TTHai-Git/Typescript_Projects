import Brand from "../models/brand.js";
import Category from "../models/category.js";
import Favorite from "../models/favorite.js";
import Product from "../models/product.js";
import Vendor from "../models/vendor.js";

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
  if (!existsFavorite) {
    const newFavorite = await Favorite.create({
      user: userId,
      product: productId,
    });
    return res.status(201).json(newFavorite);
  } else {
    existsFavorite.isFavorite = !existsFavorite.isFavorite;
    existsFavorite.save();
    return res.status(200).json(existsFavorite);
  }
};

export const getFavoriteProductOfUser = async (req, res) => {
  const { productId, userId } = req.params;
  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "Request body must userId and productId" });
  }
  const existsFavorite = await Favorite.findOne({
    product: productId,
    user: userId,
  });
  if (!existsFavorite) {
    return res.status(200).json({ isFavorite: false });
  } else {
    return res.status(200).json({ isFavorite: existsFavorite.isFavorite });
  }
};

export const getFavoriteProductsList = async (req, res) => {
  const { userId } = req.params;
  const perPage = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;
  const { category, search, sort } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Request body must userId" });
  }

  try {
    const productFilter = {};
    if (category) {
      productFilter.category = category;
    }
    if (search) {
      productFilter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Step 1: Get matching product IDs
    const matchedProducts = await Product.find(productFilter).select("_id");
    const matchedProductIds = matchedProducts.map((p) => p._id);

    // Step 2: Sorting logic for Favorite
    let favoriteSort = { createdAt: -1 }; // Default
    if (sort === "latest") favoriteSort = { createdAt: -1 };
    else if (sort === "oldest") favoriteSort = { createdAt: 1 };

    // Step 3: Find Favorites
    const favorites = await Favorite.find({
      user: userId,
      isFavorite: true,
      product: { $in: matchedProductIds },
    })
      .sort(favoriteSort)
      .skip(perPage * (page - 1))
      .limit(perPage);

    if (favorites.length === 0) {
      return res.status(204).json({ message: "No Favorite Product Found" });
    }

    // Step 4: Load related Products
    const productIds = favorites.map((fav) => fav.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productsMap = new Map(
      products.map((prod) => [prod._id.toString(), prod])
    );

    // Step 5: Compose combined data
    let combinedData = [];
    for (const favorite of favorites) {
      const product = productsMap.get(favorite.product.toString());
      if (!product) continue;

      const [brand, vendor, category] = await Promise.all([
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
          category,
          vendor,
          brand,
        },
      });
    }

    // Step 6: Sort by Product fields if needed
    if (sort === "price_asc") {
      combinedData.sort((a, b) => a.product.price - b.product.price);
    } else if (sort === "price_desc") {
      combinedData.sort((a, b) => b.product.price - a.product.price);
    } else if (sort === "az") {
      combinedData.sort((a, b) => a.product.name.localeCompare(b.product.name));
    } else if (sort === "za") {
      combinedData.sort((a, b) => b.product.name.localeCompare(a.product.name));
    }

    // Step 7: Total count
    const totalFavorites = await Favorite.countDocuments({
      user: userId,
      isFavorite: true,
      product: { $in: matchedProductIds },
    });

    return res.status(200).json({
      results: combinedData,
      current: page,
      pages: Math.ceil(totalFavorites / perPage),
      total: totalFavorites,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;
    const favorite = await Favorite.findByIdAndDelete(favoriteId);
    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found to delete" });
    }
    if (!req.user._id.equals(favorite.user)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this favorite" });
    }
    res.status(204).json({ message: "Favorite deleted successfully" });
  } catch (error) {
    console.error("Error delete Favorite:", error);
    res.status(500).json({ message: "server error", error });
  }
};
