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
app.use ("/v1/vouchers", voucherRouter)

app.get("/v1/", (req, res) => {
  res.send("Welcome to the Pet Shop API!");
});
app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port", process.env.PORT || 5000);
});

// Export for Vercel
export default app;
