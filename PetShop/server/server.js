import express from "express";
import { urlencoded, json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";


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
import chatBotRoutes from "./routes/chatBot.js";
import csrfRoutes from "./routes/csrf.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// Connect to MongoDB (run once)
connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((error) =>
    console.error("Error connecting to MongoDB:", error.message)
  );

// Middleware
app.use(urlencoded({ extended: false }));
app.use(
  cors({
    origin: [
      process.env.REACT_APP_PUBLIC_URL_VERCEL_CLIENT,
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(json());
app.use(cookieParser());

// ===== Helmet ============
app.use(helmet())

// ===== Rate Limiting =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // tối đa 100 request / 15 phút / IP
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use("/v1/auth", authRoutes, limiter);
app.use("/v1/roles", roleRoutes, limiter);
app.use("/v1/users", userRoutes, limiter);
app.use("/v1/orders", orderRoutes, limiter);
app.use("/v1/orderDetails", orderDetailsRoutes, limiter);
app.use("/v1/categories", categoryRoutes, limiter);
app.use("/v1/vendors", vendorRouter, limiter);
app.use("/v1/brands", brandRouter, limiter);
app.use("/v1/products", productRoutes, limiter);
app.use("/v1/breeds", breedRoutes, limiter);
app.use("/v1/favorites", favoriteRoutes, limiter);
app.use("/v1/comments", commentRoutes, limiter);
app.use("/v1/commentDetails", commentDetailsRoutes, limiter);
app.use("/v1/payments", paymentRoutes, limiter);
app.use("/v1/vnpay", VNPayRouter, limiter);
app.use("/v1/payOS", payOSRouter, limiter);
app.use("/v1/shipments", shipmentRoutes, limiter);
app.use("/v1/vouchers", voucherRouter, limiter);
app.use("/v1/chat-bot-faq", chatBotRoutes, limiter);
app.use("/v1/csrf-protection", csrfRoutes, limiter)
// Admin CRUD routes
app.use(
  "/v1/admin/brands",
  generateCrudRoutes(Brand, "", {
    searchableFields: ["_id", "name", "description"],
    sortableFields: ["name", "descrption", "createdAt", "updatedAt"],
  }) , limiter
);

app.use(
  "/v1/admin/breeds",
  generateCrudRoutes(Breed, "", {
    searchableFields: ["_id", "name", "description"],
    sortableFields: ["name", "createdAt", "updatedAt"],
  }), limiter
);

app.use(
  "/v1/admin/categories",
  generateCrudRoutes(Category, "", {
    searchableFields: ["_id", "name", "description"],
    sortableFields: ["name", "createdAt", "updatedAt"],
  }), limiter
);

app.use(
  "/v1/admin/comments",
  generateCrudRoutes(Comment, "comments", {
    searchableFields: ["_id", "user", "product", "content"],
    sortableFields: ["rating", "createdAt", "updatedAt"],
  }), limiter
);

app.use(
  "/v1/admin/commentDetails",
  generateCrudRoutes(CommentDetails, "commentDetails", {
    searchableFields: ["_id", "url", "public_id", "comment"],
    sortableFields: ["createdAt", "updatedAt"],
  }), limiter
);

app.use(
  "/v1/admin/favorites",
  generateCrudRoutes(Favorite, "favorites", {
    searchableFields: ["_id", "user", "product"],
    sortableFields: ["createdAt", "updatedAt"],
  }), limiter
);

app.use(
  "/v1/admin/orders",
  generateCrudRoutes(Order, "orders", {
    searchableFields: ["_id", "user", "status"],
    sortableFields: ["totalPrice", "createdAt", "updatedAt"],
  }), limiter
);

app.use(
  "/v1/admin/orderDetails",
  generateCrudRoutes(OrderDetails, "orderDetails", {
    searchableFields: ["_id", "order", "product", "note"],
    sortableFields: ["price", "quantity", "createdAt", "updatedAt"],
  }), limiter
);

app.use(
  "/v1/admin/payments",
  generateCrudRoutes(Payment, "payments", {
    searchableFields: ["_id", "method", "provider", "order"],
    sortableFields: ["createdAt", "updatedAt"],
  }), limiter
);

app.use(
  "/v1/admin/products",
  generateCrudRoutes(Product, "products", {
    searchableFields: ["_id", "name", "description", "status"],
    sortableFields: ["name", "description", "price", "createdAt", "updatedAt"],
  }), limiter
);

app.use(
  "/v1/admin/roles",
  generateCrudRoutes(Role, "roles", {
    searchableFields: ["_id", "name"],
    sortableFields: ["name", "createdAt", "updatedAt"],
  }), limiter
);

app.use(
  "/v1/admin/shipments",
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
  }), limiter
);

app.use(
  "/v1/admin/users",
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
  }), limiter
);

app.use(
  "/v1/admin/vendors",
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
  }), limiter
);
app.use(
  "/v1/admin/vouchers",
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
  }), limiter
);

app.get("/v1/", (req, res) => {
  res.send("Welcome to the Pet Shop API!");
});
app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running on port", process.env.PORT || 8080);
});

// Export for Vercel
export default app;
