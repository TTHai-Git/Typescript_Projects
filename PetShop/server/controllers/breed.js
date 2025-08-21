import Breed from "../models/breed.js";

export const getAllBreeds = async (req, res) => {
  try {
    const breeds = await Breed.find();
    res.status(200).json(breeds);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBreedById = async (req, res) => {
  const { breedId } = req.params;
  try {
    const breed = await Breed.findById(breedId);
    if (!breed) {
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
    return res.status(201).json(breed);
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
    return res.status(200).json({ message: "Breed deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
