import Brand from "../models/brand.js";
import Category from "../models/category.js";
import Product from "../models/product.js";
import AccessoryProduct from "../models/productaccessory.js";
import ClothesProduct from "../models/productclothes.js";
import FoodProduct from "../models/productfood.js";
import Vendor from "../models/vendor.js";

const productTypes = {
  food: FoodProduct,
  clothes: ClothesProduct,
  accessory: AccessoryProduct,
};

export const getAllProducts = async (req, res) => {
  const perPage = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;
  const { category } = req.query;

  try {
    const filter = {};
    if (category) {
      filter.category = category;
    }

    const productsFromDB = await Product.find(filter)
      .skip(perPage * (page - 1))
      .limit(perPage);

    const categoryDocs = {}; // cache categories
    const products = [];

    for (const product of productsFromDB) {
      const catId = product.category;
      if (!categoryDocs[catId]) {
        categoryDocs[catId] = await Category.findById(catId);
      }

      const vendor = await Vendor.findById(product.vendor);
      const brand = await Brand.findById(product.brand);

      products.push({
        _id: product._id || null,
        type: product.__t,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        category: categoryDocs[catId],
        vendor,
        brand,
      });
    }

    const count = await Product.countDocuments(filter);

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json({
      products,
      current: page,
      pages: Math.ceil(count / perPage),
      total: count,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { type, product_id } = req.params;
    const model = productTypes[type];
    const product = await model.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const category = await Category.findById(product.category);
    const vendor = await Vendor.findById(product.vendor);
    const brand = await Brand.findById(product.brand);
    const data = {
      ...product._doc,
      category: category,
      vendor: vendor,
      brand: brand,
    };

    return res.status(200).json({ product: data });
  } catch (error) {
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
      category_id,
      brand_id,
      vendor_id,
      ...rest
    } = req.body;

    const Model = productTypes[type];

    if (!Model) {
      return res.status(400).json({ message: `Invalid product type: ${type}` });
    }

    const newProduct = await Model.create({
      name,
      description,
      price,
      status,
      category: category_id,
      brand: brand_id,
      vendor: vendor_id,
      ...rest, // contains type-specific fields like ingredients, size, etc.
    });

    return res.status(201).json(newProduct);
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
    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const product = await Product.findByIdAndDelete(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found to delete" });
    }
    res.status(204).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
