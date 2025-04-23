import mongoose from "mongoose";
import Category from "../models/category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "no categories found" });
    }
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "server error", error });
  }
};

export const getCatgoryById = async (req, res) => {
  try {
    const { cate_id } = req.params;

    const category = await Category.findById(cate_id);
    // check if category is null or undefined
    if (!category) {
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
    res.status(201).json(category);
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
    res.status(200).json(category);
  } catch (error) {
    console.error("Error update category:", error);
    res.status(500).json({ message: "server error", error });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const { cate_id } = req.params;
    const category = await Category.findByIdAndDelete(cate_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found to delete" });
    }
    res.status(204).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error delete category:", error);
    res.status(500).json({ message: "server error", error });
  }
};
