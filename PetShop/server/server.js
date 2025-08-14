import express from "express";
import { urlencoded, json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import orderDetailsRoutes from "./routes/orderdetails.js";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import vendorRouter from "./routes/vendor.js";
import brandRouter from "./routes/brand.js";
import breedRoutes from "./routes/breed.js";
import roleRoutes from "./routes/role.js";
import userRoutes from "./routes/user.js";
import favoriteRoutes from "./routes/favorite.js";
import commentRoutes from "./routes/comment.js";
import commentDetailsRoutes from "./routes/commentdetails.js";
import paymentRoutes from "./routes/payment.js";
import VNPayRouter from "./services/vnPayPayment.js";
import payOSRouter from "./services/payOSPayment.js";
import cookieParser from "cookie-parser";
import shipmentRoutes from "./routes/shipment.js";
import voucherRouter from "./routes/voucher.js";
import generateCrudRoutes from "./routes/CRUD.js";
import User from "./models/user.js";
import Product from "./models/product.js";
import Brand from "./models/brand.js";
import Category from "./models/category.js";
import Comment from "./models/comment.js";
import CommentDetails from "./models/commentdetails.js";
import Favorite from "./models/favorite.js";
import Order from "./models/order.js";
import OrderDetails from "./models/orderdetails.js";
import Payment from "./models/payment.js";
import Shipment from "./models/shipment.js";
import Breed from "./models/breed.js";
import Vendor from "./models/vendor.js";
import Voucher from "./models/voucher.js";
import Role from "./models/role.js";

dotenv.config();

const app = express();

// Connect to MongoDB (run once)
connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((error) =>
    console.error("Error connecting to MongoDB:", error.message)
  );

// Middleware
app.use(urlencoded({ extended: false }));
app.use(cors());
app.use(json());
app.use(cookieParser());

// Routes
app.use("/v1/auth", authRoutes);
app.use("/v1/roles", roleRoutes);
app.use("/v1/users", userRoutes);
app.use("/v1/orders", orderRoutes);
app.use("/v1/orderDetails", orderDetailsRoutes);
app.use("/v1/categories", categoryRoutes);
app.use("/v1/vendors", vendorRouter);
app.use("/v1/brands", brandRouter);
app.use("/v1/products", productRoutes);
app.use("/v1/breeds", breedRoutes);
app.use("/v1/favorites", favoriteRoutes);
app.use("/v1/comments", commentRoutes);
app.use("/v1/commentDetails", commentDetailsRoutes);
app.use("/v1/payments", paymentRoutes);
app.use("/api/vnpay", VNPayRouter);
app.use("/api/payOS", payOSRouter);
app.use("/v1/shipments", shipmentRoutes);
app.use("/v1/vouchers", voucherRouter);
// Admin CRUD routes
app.use(
  "/api/admin/brands",
  generateCrudRoutes(Brand, "", {
    searchableFields: ["_id", "name", "description"],
    sortableFields: ["name", "descrption", "createdAt", "updatedAt"],
  })
);

app.use(
  "/api/admin/breeds",
  generateCrudRoutes(Breed, "", {
    searchableFields: ["_id", "name", "description"],
    sortableFields: ["name", "createdAt", "updatedAt"],
  })
);

app.use(
  "/api/admin/categories",
  generateCrudRoutes(Category, "", {
    searchableFields: ["_id", "name", "description"],
    sortableFields: ["name", "createdAt", "updatedAt"],
  })
);

app.use(
  "/api/admin/comments",
  generateCrudRoutes(Comment, "comments", {
    searchableFields: ["_id", "user", "product", "content"],
    sortableFields: ["rating", "createdAt", "updatedAt"],
  })
);

app.use(
  "/api/admin/commentDetails",
  generateCrudRoutes(CommentDetails, "commentDetails", {
    searchableFields: ["_id", "url", "public_id", "comment"],
    sortableFields: ["createdAt", "updatedAt"],
  })
);

app.use(
  "/api/admin/favorites",
  generateCrudRoutes(Favorite, "favorites", {
    searchableFields: ["_id", "user", "product"],
    sortableFields: ["createdAt", "updatedAt"],
  })
);

app.use(
  "/api/admin/orders",
  generateCrudRoutes(Order, "orders", {
    searchableFields: ["_id", "user", "status"],
    sortableFields: ["totalPrice", "createdAt", "updatedAt"],
  })
);

app.use(
  "/api/admin/orderDetails",
  generateCrudRoutes(OrderDetails, "orderDetails", {
    searchableFields: ["_id", "order", "product", "note"],
    sortableFields: ["price", "quantity", "createdAt", "updatedAt"],
  })
);

app.use(
  "/api/admin/payments",
  generateCrudRoutes(Payment, "payments", {
    searchableFields: ["_id", "method", "provider", "order"],
    sortableFields: ["createdAt", "updatedAt"],
  })
);

app.use(
  "/api/admin/products",
  generateCrudRoutes(Product, "products", {
    searchableFields: ["_id", "name", "description", "status"],
    sortableFields: ["name", "description", "price", "createdAt", "updatedAt"],
  })
);

app.use(
  "/api/admin/roles",
  generateCrudRoutes(Role, "roles", {
    searchableFields: ["_id", "name"],
    sortableFields: ["name", "createdAt", "updatedAt"],
  })
);

app.use(
  "/api/admin/shipments",
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

app.use(
  "/api/admin/users",
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

app.use(
  "/api/admin/vendors",
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
app.use(
  "/api/admin/vouchers",
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

app.get("/v1/", (req, res) => {
  res.send("Welcome to the Pet Shop API!");
});
app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running on port", process.env.PORT || 8080);
});

// Export for Vercel
export default app;
