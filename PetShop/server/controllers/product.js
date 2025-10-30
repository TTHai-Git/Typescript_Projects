import Brand from "../models/brand.js";
import Breed from "../models/breed.js";
import Category from "../models/category.js";
import Product from "../models/product.js";
import AccessoryProduct from "../models/productaccessory.js";
import ClothesProduct from "../models/productclothes.js";
import DogProduct from "../models/productdog.js";
import FoodProduct from "../models/productfood.js";
import Vendor from "../models/vendor.js";
import Comment from "../models/comment.js";
import OrderDetails from "../models/orderdetails.js";
import { countFavoriteOfProduct } from "../controllers/favorite.js";
import { clearCacheByKeyword, getOrSetCachedData } from "./redis.js";
export const productTypes = {
  dog: DogProduct,
  food: FoodProduct,
  clothes: ClothesProduct,
  accessory: AccessoryProduct,
};

export const roundFirstDecimal = (num) => {
  const fixed = Number(num.toFixed(2)); // e.g., 3.17 or 3.14

  const intPart = Math.floor(fixed); // e.g., 3
  const decimalPart = fixed - intPart; // e.g., 0.17 or 0.14

  const firstDecimalDigit = Math.floor(decimalPart * 10); // e.g., 1
  const secondDecimalDigit = Math.floor((decimalPart * 100) % 10); // e.g., 7 or 4

  const roundedDecimal =
    secondDecimalDigit >= 5 ? firstDecimalDigit + 1 : firstDecimalDigit;

  // Handle carry-over (e.g., 3.99 → 4.0)
  if (roundedDecimal === 10) {
    return intPart + 1;
  }

  return parseFloat(`${intPart}.${roundedDecimal}`);
};

const calculateTotalOrderOfProduct = async (productId) => {
  const orderDetails = await OrderDetails.find({ product: productId });
  let totalOrder = 0;
  for (const orderDetail of orderDetails) {
    totalOrder = totalOrder + orderDetail.quantity;
  }
  return totalOrder;
};

export const calculateRating = async (productId) => {
  const comments = await Comment.find({ product: productId });
  // console.log(comments.length);

  let totalRating = 0;
  let count_rating_one_start = 0;
  let count_rating_two_start = 0;
  let count_rating_three_start = 0;
  let count_rating_four_start = 0;
  let count_rating_five_start = 0;

  if (comments.length > 0) {
    for (const comment of comments) {
      if (comment.rating === 1) {
        count_rating_one_start = count_rating_one_start + 1;
      } else if (comment.rating === 2) {
        count_rating_two_start = count_rating_two_start + 1;
      } else if (comment.rating === 3) {
        count_rating_three_start = count_rating_three_start + 1;
      } else if (comment.rating === 4) {
        count_rating_four_start = count_rating_four_start + 1;
      } else {
        count_rating_five_start = count_rating_five_start + 1;
      }
    }

    totalRating =
      (count_rating_one_start +
        count_rating_two_start * 2 +
        count_rating_three_start * 3 +
        count_rating_four_start * 4 +
        count_rating_five_start * 5) /
      comments.length;
  }

  const beforeTotalRatingRounded = roundFirstDecimal(totalRating);

  const decimalPart = totalRating - Math.floor(totalRating);
  // console.log("decimalPart", decimalPart);
  if (decimalPart >= 0.5) {
    totalRating = Math.ceil(totalRating);
  } else {
    totalRating = Math.floor(totalRating);
  }

  // console.log("beforeTotalRatingRound", beforeTotalRatingRound);
  // console.log("AfterTotalRatingRound", totalRating);
  return {
    beforeTotalRatingRounded: beforeTotalRatingRounded,
    totalRating: totalRating,
  };
};

export const getAllProducts = async (req, res) => {
  const perPage = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;
  const { category, search, sort } = req.query;

  // Define unique cache key for this query
  const cacheKey = `GET:/v1/products?page=${page}&limit=${perPage}&category=${
    category || ""
  }&search=${search || ""}&sort=${sort || ""}`;

  try {
    // Fetch data with caching helper
    const productsData = await getOrSetCachedData(cacheKey, async () => {
      const filter = {};
      if (category) filter.category = category;
      if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }];

      // Sorting options
      let sortOption = {};
      switch (sort) {
        case "price_asc":
          sortOption.price = 1;
          break;
        case "price_desc":
          sortOption.price = -1;
          break;
        case "latest":
          sortOption.createdAt = -1;
          break;
        case "oldest":
          sortOption.createdAt = 1;
          break;
        case "az":
          sortOption.name = 1;
          break;
        case "za":
          sortOption.name = -1;
          break;
        default:
          sortOption.createdAt = -1;
      }

      // Get products
      const productsFromDB = await Product.find(filter)
        .populate("category vendor brand")
        .sort(sortOption)
        .skip(perPage * (page - 1))
        .limit(perPage);

      // Add rating & order info
      const products = await Promise.all(
        productsFromDB.map(async (product) => {
          const rating = await calculateRating(product._id);
          const totalOrder = await calculateTotalOrderOfProduct(product._id);
          return {
            ...product.toObject(),
            totalRating: rating.totalRating,
            beforeTotalRatingRounded: rating.beforeTotalRatingRounded,
            totalOrder,
          };
        })
      );

      const count = await Product.countDocuments(filter);

      // Return plain data (NOT res.json)
      return {
        products,
        current: page,
        pages: Math.ceil(count / perPage),
        total: count,
      };
    });

    // ✅ Send response here (after cache logic)
    return res.status(200).json(productsData);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { type, product_id } = req.params;
    const model = productTypes[type];

    if (!model) {
      return res.status(400).json({ message: "Invalid product type" });
    }

    // ✅ Use endpoint-based cache key
    const cacheKey = `GET:/v1/products/${product_id}`;

    // Use caching helper
    const productData = await getOrSetCachedData(cacheKey, async () => {
      const product = await model.findById(product_id);
      if (!product) throw new Error("Product not found");

      const [category, vendor, brand] = await Promise.all([
        Category.findById(product.category),
        Vendor.findById(product.vendor),
        Brand.findById(product.brand),
      ]);

      if (!category || !vendor || !brand) {
        throw new Error("Related entities not found");
      }

      let breed = null;
      if (type === "dog") {
        breed = await Breed.findById(product.breed);
        if (!breed) throw new Error("Breed not found");
      }

      const [rating, totalOrder, countFavorite] = await Promise.all([
        calculateRating(product._id),
        calculateTotalOrderOfProduct(product._id),
        countFavoriteOfProduct(product._id),
      ]);

      return {
        product: {
          ...product.toObject(),
          breed,
          category,
          vendor,
          brand,
          totalRating: rating.totalRating,
          beforeTotalRatingRounded: rating.beforeTotalRatingRounded,
          totalOrder,
          countFavorite,
        },
      };
    });

    // ✅ Return response here (after caching)
    return res.status(200).json(productData);
  } catch (error) {
    console.error("❌ Error in getProductById:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      type,
      name,
      description,
      price,
      status,
      category,
      brand,
      vendor,
      ...rest
    } = req.body;

    // console.log("req.body", req.body);
    const Model = productTypes[type];

    if (!Model) {
      return res.status(400).json({ message: `Invalid product type: ${type}` });
    }

    const newProduct = await Model.create({
      name,
      description,
      price,
      status,
      category: category,
      brand: brand,
      vendor: vendor,
      ...rest, // contains type-specific fields like ingredients, size, etc.
    });

    //clear data of products
    // await clearCacheByKeyword("products");

    return res
      .status(201)
      .json({ doc: newProduct, message: "Product created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Update data is required" });
    }
    const product = await Product.findByIdAndUpdate(product_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //clear data of products
    // await clearCacheByKeyword("products");

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found to delete" });
    }
    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateStock = async (product_id, quantity) => {
  // console.log("product_id", product_id);
  // console.log("quantity", quantity);

  const product = await Product.findByIdAndUpdate(
    product_id,
    { $inc: { stock: -quantity } },
    { new: true }
  );

  if (product.stock < 0) {
    product.stock = 0;
    product.status = false;
  }
  await product.save();
};
