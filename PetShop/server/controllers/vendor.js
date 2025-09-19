import Vendor from "../models/vendor.js";
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    if (!vendors || vendors.length === 0) {
      return res.status(404).json({ message: "no vendors found" });
    }
    res.status(200).json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "server error", error });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const { vendor_id } = req.params;

    const vendor = await Vendor.findById(vendor_id);
    // check if category is null or undefined
    if (!vendor) {
      return res.status(404).json({ message: "vendor not found" });
    }
    res.status(200).json(vendor);
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ message: "server error", error });
  }
};

export const createVendor = async (req, res) => {
  try {
    const { name, contactInfo, address, email, phone } = req.body;

    // Check if a category with the same name already exists
    const existsvendor = await Vendor.find({ name: name }); // returns an array of documents
    // console.log("existsvendor", existsvendor);
    if (existsvendor.length > 0) {
      return res.status(400).json({ message: "vendor already exists" });
    }

    const vendor = await Vendor.create({
      name,
      contactInfo,
      address,
      email,
      phone,
    });
    res
      .status(201)
      .json({ doc: vendor, message: "Vendor created successfully" });
  } catch (error) {
    console.error("Error create vendor:", error);
    res.status(500).json({ message: "server error", error });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const { vendor_id } = req.params;

    // Ensure request body is not empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Update data is required" });
    }

    const vendor = await vendor.findByIdAndUpdate(vendor_id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure the updated fields follow schema validation
    });

    if (!vendor) {
      return res.status(404).json({ message: "vendor not found" });
    }
    res.status(200).json(vendor);
  } catch (error) {
    console.error("Error update vendor:", error);
    res.status(500).json({ message: "server error", error });
  }
};
export const deleteVendor = async (req, res) => {
  try {
    const { vendor_id } = req.params;
    const vendor = await Vendor.findById(vendor_id);
    if (!vendor) {
      return res.status(404).json({ message: "vendor not found to delete" });
    }
    await vendor.deleteOne();
    res.status(200).json({ message: "vendor deleted successfully" });
  } catch (error) {
    console.error("Error delete vendor:", error);
    res.status(500).json({ message: "server error", error });
  }
};
export const calculateDiscountPrice = (price, discount) => {
  // final price after discount, rounded if you like
  return Math.ceil(price * (1 - discount / 100));
};
