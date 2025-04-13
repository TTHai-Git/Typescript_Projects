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

dotenv.config();

const app = express();

// Middleware
app.use(urlencoded({ extended: false })); // request with form data
app.use(cors());
app.use(json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/v1/orders", orderRoutes);
app.use("/v1/orderDetails", orderDetailsRoutes);
app.use("/v1/categories", categoryRoutes);
app.use("/v1/vendors", vendorRouter);
app.use("/v1/brands", brandRouter);
app.use("/v1/products", productRoutes);
app.use("/v1/breeds", breedRoutes);

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Connect to MongoDB
connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((error) =>
    console.error("Error connecting to MongoDB:", error.message)
  );
