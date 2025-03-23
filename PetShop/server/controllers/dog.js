import mongoose from "mongoose";
import Dog from "../models/dog.js"; // Ensure the correct import

export const getDogs = async (req, res) => {
  const perPage = 5; // Number of items per page
  const page = parseInt(req.params.page) || 1; // Convert page to a number

  try {
    // Fetch dogs with pagination
    const dogs = await Dog.find()
      .skip(perPage * (page - 1)) // Corrected the skip logic
      .limit(perPage);

    // Count total documents
    const count = await Dog.countDocuments();

    const data = [];
    for (const dog of dogs) {
      data.push({
        _id: dog._id,
        name: dog.name,
        imageUrl: dog.imageUrl,
        price: dog.price,
      });
    }
    res.status(200).json({
      dogs: data,
      current: page, // Current page
      pages: Math.ceil(count / perPage), // Total number of pages
      total: count, // Total number of dogs
    });
  } catch (error) {
    console.error("Error fetching dogs:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getDog = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("Received ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const dog = await Dog.findById(id);
    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    res.status(200).json(dog);
  } catch (error) {
    console.error("Error fetching dog:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const createDog = async (req, res) => {
  try {
    const dog = await Dog.create(req.body);
    res.status(201).json(dog);
  } catch (error) {
    console.error("Error creating dog:", error);
    res.status(500).json({ message: "Error creating dog", error });
  }
};

export const updateDog = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("Received ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const dog = await Dog.findByIdAndUpdate(id, req.body, { new: true });
    if (!dog) {
      return res.status(404).json({ message: "No Dog Found" });
    }

    res.status(200).json(dog);
  } catch (error) {
    console.error("Error updating dog:", error);
    res.status(500).json({ message: "Error updating dog", error });
  }
};

export const deleteDog = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const dog = await Dog.findByIdAndDelete(id);
    if (!dog) {
      return res.status(404).json({ message: "No Dog Found" });
    }

    res.status(200).json({ message: "Dog Deleted" });
  } catch (error) {
    console.error("Error deleting dog:", error);
    res.status(500).json({ message: "Error deleting dog", error });
  }
};
