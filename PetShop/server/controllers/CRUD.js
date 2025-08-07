import Product from "../models/product.js";
import { createProduct } from "./product.js";

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

export const createOne = (Model) => async (req, res) => {
  try {
    // console.log("req.body", req.body);
    // console.log("Model", Model);
    if (Model === Product) {
      return createProduct(req, res);
    }
    const doc = await Model.create(req.body);
    res.status(201).json(doc);
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

export const readOne = (Model) => async (req, res) => {
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
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteOne = (Model) => async (req, res) => {
  try {
    await Model.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
