import Brand from "../models/brand.js";

export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    if (!brands || brands.length === 0) {
      return res.status(404).json({ message: "no brands found" });
    }
    res.status(200).json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "server error", error });
  }
};

export const getbrandById = async (req, res) => {
  try {
    const { brand_id } = req.params;

    const brand = await Brand.findById(brand_id);
    // check if category is null or undefined
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(brand);
  } catch (error) {
    console.error("Error fetching brand:", error);
    res.status(500).json({ message: "server error", error });
  }
};

export const createBrand = async (req, res) => {
  try {
    const { name, description, logoUrl } = req.body;

    // Check if a category with the same name already exists
    const existsBrand = await Brand.find({ name: name }); // returns an array of documents
    // console.log("existsBrand", existsBrand);
    if (existsBrand.length > 0) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    const brand = await Brand.create({ name, description, logoUrl });
    res.status(201).json(brand);
  } catch (error) {
    console.error("Error create brand:", error);
    res.status(500).json({ message: "server error", error });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { brand_id } = req.params;

    // Ensure request body is not empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Update data is required" });
    }

    const brand = await Brand.findByIdAndUpdate(brand_id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure the updated fields follow schema validation
    });

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(brand);
  } catch (error) {
    console.error("Error update brand:", error);
    res.status(500).json({ message: "server error", error });
  }
};
export const deleteBrand = async (req, res) => {
  try {
    const { brand_id } = req.params;
    const brand = await Brand.findById(brand_id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found to delete" });
    }
    await brand.deleteOne();
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error delete brand:", error);
    res.status(500).json({ message: "server error", error });
  }
};
