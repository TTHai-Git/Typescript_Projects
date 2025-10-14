import express from "express";
import Brand from "../../models/brand.js";
import generateCrudRoutes from "../CRUD.js";
import Breed from "../../models/breed.js";
import Category from "../../models/category.js";
import Comment from "../../models/comment.js";
import CommentDetails from "../../models/commentdetails.js";
import Favorite from "../../models/favorite.js";
import Order from "../../models/order.js";
import OrderDetails from "../../models/orderdetails.js";
import Payment from "../../models/payment.js";
import Product from "../../models/product.js";
import Role from "../../models/role.js";
import Shipment from "../../models/shipment.js";
import User from "../../models/user.js";
import Vendor from "../../models/vendor.js";
import Voucher from "../../models/voucher.js";
import statsRoutes from "../stats.js";
import limiter from "../../middleware/limiter.js";
const adminRouter = express.Router();

// Admin CRUD routes
adminRouter.use("/stats", limiter, statsRoutes);

adminRouter.use(
  "/brands",
  limiter,
  generateCrudRoutes(Brand, "", {
    searchableFields: ["_id", "name", "description"],
    sortableFields: ["name", "descrption", "createdAt", "updatedAt"],
  })
);

adminRouter.use(
  "/breeds",
  limiter,
  generateCrudRoutes(Breed, "", {
    searchableFields: ["_id", "name", "description"],
    sortableFields: ["name", "createdAt", "updatedAt"],
  })
);

adminRouter.use(
  "/categories",
  limiter,
  generateCrudRoutes(Category, "", {
    searchableFields: ["_id", "name", "description"],
    sortableFields: ["name", "createdAt", "updatedAt"],
  })
);

adminRouter.use(
  "/comments",
  limiter,
  generateCrudRoutes(Comment, "comments", {
    searchableFields: ["_id", "user", "product", "content"],
    sortableFields: ["rating", "createdAt", "updatedAt"],
  })
);

adminRouter.use(
  "/commentDetails",
  limiter,
  generateCrudRoutes(CommentDetails, "commentDetails", {
    searchableFields: ["_id", "url", "public_id", "comment"],
    sortableFields: ["createdAt", "updatedAt"],
  })
);

adminRouter.use(
  "/favorites",
  limiter,
  generateCrudRoutes(Favorite, "favorites", {
    searchableFields: ["_id", "user", "product"],
    sortableFields: ["createdAt", "updatedAt"],
  })
);

adminRouter.use(
  "/orders",
  limiter,
  generateCrudRoutes(Order, "orders", {
    searchableFields: ["_id", "user", "status"],
    sortableFields: ["totalPrice", "createdAt", "updatedAt"],
  })
);

adminRouter.use(
  "/orderDetails",
  limiter,
  generateCrudRoutes(OrderDetails, "orderDetails", {
    searchableFields: ["_id", "order", "product", "note"],
    sortableFields: ["price", "quantity", "createdAt", "updatedAt"],
  })
);

adminRouter.use(
  "/payments",
  limiter,
  generateCrudRoutes(Payment, "payments", {
    searchableFields: ["_id", "method", "provider", "order"],
    sortableFields: ["createdAt", "updatedAt"],
  })
);

adminRouter.use(
  "/products",
  limiter,
  generateCrudRoutes(Product, "products", {
    searchableFields: ["_id", "name", "description", "status"],
    sortableFields: ["name", "description", "price", "createdAt", "updatedAt"],
  })
);

adminRouter.use(
  "/roles",
  limiter,
  generateCrudRoutes(Role, "roles", {
    searchableFields: ["_id", "name"],
    sortableFields: ["name", "createdAt", "updatedAt"],
  })
);

adminRouter.use(
  "/shipments",
  limiter,
  generateCrudRoutes(Shipment, "shipments", {
    searchableFields: [
      "_id",
      "method",
      "buyerName",
      "buyerPhone",
      "buyerAddress",
      "order",
    ],
    sortableFields: ["fee", "createdAt", "updatedAt"],
  })
);

adminRouter.use(
  "/users",
  limiter,
  generateCrudRoutes(User, "users", {
    searchableFields: [
      "_id",
      "username",
      "name",
      "email",
      "phone",
      "address",
      "role",
      "isVerified",
    ],
    sortableFields: [
      "username",
      "name",
      "email",
      "phone",
      "address",
      "createdAt",
      "updatedAt",
    ],
  })
);

adminRouter.use(
  "/vendors",
  limiter,
  generateCrudRoutes(Vendor, "vendors", {
    searchableFields: [
      "_id",
      "name",
      "contactInfo",
      "address",
      "email",
      "phone",
    ],
    sortableFields: [
      "name",
      "contactInfo",
      "address",
      "email",
      "phone",
      "createdAt",
      "updatedAt",
    ],
  })
);

adminRouter.use(
  "/vouchers",
  limiter,
  generateCrudRoutes(Voucher, "vouchers", {
    searchableFields: ["_id", "code", "isActive"],
    sortableFields: [
      "code",
      "discount",
      "expiryDate",
      "usageCount",
      "maxUsage",
      "createdAt",
      "updatedAt",
    ],
  })
);

export default adminRouter;