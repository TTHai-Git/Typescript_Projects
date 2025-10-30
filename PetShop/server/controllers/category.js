import Category from "../models/category.js";
import getRedisClient from "../config/redisCloud.config.js";
import { clearCacheByKeyword, getOrSetCachedData } from "./redis.js";

export const getCategories = async (req, res) => {
  try {
    const cacheKey = "GET:/v1/categories";

    const categories = await getOrSetCachedData(cacheKey, async () => {
      const data = await Category.find();
      return data;
    });

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "no categories found" });
    }

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "server error", error });
  }
};

export const getCatgoryById = async (req, res) => {
  const { cate_id } = req.params;
  const cacheKey = `GET:/v1/categories/${cate_id}`;

  try {
    const category = await getOrSetCachedData(cacheKey, async () => {
      const data = await Category.findById(cate_id);
      return data;
    });
    // check if category is null or undefined
    if (!category || category.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "server error", error });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if a category with the same name already exists
    const existsCategory = await Category.find({ name: name }); // returns an array of documents
    // console.log("existsCategory", existsCategory);
    if (existsCategory.length > 0) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, description });

    // clear all data of categories
    // await clearCacheByKeyword("categories");

    res
      .status(201)
      .json({ doc: category, message: "Category created successfully" });
  } catch (error) {
    console.error("Error create category:", error);
    res.status(500).json({ message: "server error", error });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { cate_id } = req.params;

    // Ensure request body is not empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Update data is required" });
    }

    const category = await Category.findByIdAndUpdate(cate_id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure the updated fields follow schema validation
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // clear all data of categories
    // await clearCacheByKeyword("categories");

    res.status(200).json(category);
  } catch (error) {
    console.error("Error update category:", error);
    res.status(500).json({ message: "server error", error });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const { cate_id } = req.params;
    const category = await Category.findById(cate_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found to delete" });
    }

    await category.deleteOne();

    // clear all data of categories
    // await clearCacheByKeyword("categories");

    return res.status(204).send();
  } catch (error) {
    console.error("Error delete category:", error);
    res.status(500).json({ message: "server error", error });
  }
};
