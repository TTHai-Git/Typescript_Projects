import Product from "../models/product.js";
import AccessoryProduct from "../models/productaccessory.js";
import ClothesProduct from "../models/productclothes.js";
import FoodProduct from "../models/productfood.js";

const productTypes = {
  food: FoodProduct,
  clothes: ClothesProduct,
  accessory: AccessoryProduct,
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { product_id } = req.params;
    console.log("product_id", product_id);
    const product = await Product.findById(product_id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
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

export const DeleteProduct = async (req, res) => {
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
