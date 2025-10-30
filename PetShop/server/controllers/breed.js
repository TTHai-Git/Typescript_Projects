import Breed from "../models/breed.js";
import { clearCacheByKeyword, getOrSetCachedData } from "./redis.js";

export const getAllBreeds = async (req, res) => {
  try {
    const cacheKey = "GET:/v1/breeds";

    const breeds = await getOrSetCachedData(cacheKey, async () => {
      const data = await Breed.find();
      return data;
    });

    if (!breeds || breeds.length === 0) {
      return res.status(404).json({ message: "No breeds found" });
    }

    return res.status(200).json(breeds);
  } catch (error) {
    console.error("❌ Error fetching breeds:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getBreedById = async (req, res) => {
  const { breedId } = req.params;
  const cacheKey = `GET:/v1/breeds/${breedId}`;
  try {
    const breed = await getOrSetCachedData(cacheKey, async () => {
      const data = await Breed.findById(breedId);
      return data;
    });
    if (!breed || breed.length === 0) {
      return res.status(400).json({ message: "Breed not found" });
    }
    return res.status(200).json(breed);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createdBreed = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required" });
  }
  const existingBreed = await Breed.findOne({ name });
  if (existingBreed) {
    return res.status(400).json({ message: "Breed already exists" });
  }
  try {
    const breed = new Breed({ name, description });
    await breed.save();

    // clear all data of breeds
    await clearCacheByKeyword("breeds");

    return res
      .status(201)
      .json({ doc: breed, message: "Breed created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBreed = async (req, res) => {
  const { breedId } = req.params;
  const { name, description } = req.body;
  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required" });
  }
  try {
    const updateBreed = await Breed.findByIdAndUpdate(
      breedId,
      { name, description },
      { new: true }
    );
    if (!updateBreed) {
      return res.status(400).json({ message: "Breed not found" });
    }

    // clear all data of breeds
    await clearCacheByKeyword("breeds");

    return res.status(200).json(updateBreed);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBreedById = async (req, res) => {
  const { breedId } = req.params;
  try {
    const breed = await Breed.findById(breedId);
    if (!breed) {
      return res.status(400).json({ message: "Breed not found" });
    }
    await breed.deleteOne();

    // clear all data of breeds
    await clearCacheByKeyword("breeds");

    return res.status(200).json({ message: "Breed deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
