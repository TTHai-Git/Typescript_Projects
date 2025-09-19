import Product from "../models/product.js";
import Order from "../models/order.js";
import Notification from "../models/notification.js";
import { createProduct } from "./product.js";
import Voucher from "../models/voucher.js";
import User from "../models/user.js";

const populateConfig = {
  products: ["category", "brand", "vendor", "breed"],
  comments: ["user", "product"],
  commentDetails: ["comment"],
  favorites: ["user", "product"],
  orders: ["user"],
  orderDetails: ["order", "product"],
  payments: ["order"],
  shipments: ["order"],
  users: ["role"],
};

export const createOne = (Model, modelName) => async (req, res) => {
  try {
    console.log("req.body", req.body);
    console.log("Model", Model);
    if (Model === Product) {
      return createProduct(req, res);
    }
    const doc = await Model.create(req.body);
    console.log("Created doc:", doc);
    if (Model === Voucher) {
      const users = await User.find({ isVerified: true });
      console.log("users", users);
      for (const user of users) {
        const newNotification = await Notification.create({
          user: user._id,
          type: "VOUCHER",
          title: `New Voucher Has Been Released`,
          message: `A new voucher ${doc.code} has been released. Enjoy ${doc.discount}% off on your next purchase!`,
        });
        console.log("Notification sent to user:", user._id);
      }
    }
    res.status(201).json({
      data: doc,
      message: "Item was created successfully",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const loadDataForComboboxInForm =
  (Model, modelName) => async (req, res) => {
    try {
      let query = Model.find();
      if (modelName !== "") {
        const populateFields = populateConfig[modelName] || [];
        populateFields.forEach((field) => {
          query = query.populate(field);
        });
      }
      const docs = await query;
      res.status(200).json(docs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

export const readAll =
  (Model, modelName, options = {}) =>
  async (req, res) => {
    const {
      searchableFields = [], // for $or regex
      sortableFields = [], // for validating sort field
    } = options;

    const perPage = parseInt(req.query.perPage) || 5;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    const searchType = req.query.searchType || "partial"; // default to partial
    const sortField = req.query.sortField || "createdAt";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const searchField = req.query.searchField;
    try {
      let mongoQuery = {};

      // Dynamic $or for search
      if (search && searchField && searchableFields.includes(searchField)) {
        if (searchType === "exact") {
          mongoQuery[searchField] = search;
        } else {
          mongoQuery[searchField] = { $regex: search, $options: "i" };
        }
      }

      // Exact-match filters
      Object.entries(filters).forEach(([field, value]) => {
        if (value) mongoQuery[field] = value;
      });

      // Validate sortField against allowed sortableFields
      const finalSortField = sortableFields.includes(sortField)
        ? sortField
        : "createdAt";

      let query = Model.find(mongoQuery)
        .skip(perPage * (page - 1))
        .limit(perPage)
        .sort({ [finalSortField]: sortOrder });

      // Populate if needed
      if (modelName !== "") {
        const populateFields = populateConfig[modelName] || [];
        populateFields.forEach((field) => {
          query = query.populate(field);
        });
      }

      const docs = await query;
      const total = await Model.countDocuments(mongoQuery);

      res.status(200).json({
        docs,
        current: page,
        pages: Math.ceil(total / perPage),
        total,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

export const readOne = (Model, modelName) => async (req, res) => {
  try {
    const doc = await Model.findById(req.params.id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(404).json({ error: "Not found" });
  }
};

export const updateOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (Model === Order) {
      const newNotification = await Notification.create({
        user: doc.user,
        type: "ORDER_UPDATE",
        title: `Order ${doc._id} Status Updated`,
        message: `Order ${doc._id} has been updated status to ${doc.status}.`,
      });
    }
    res.status(200).json({
      data: doc,
      message: "Item was updated successfully",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Item not found to delete" });
    }

    return res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
