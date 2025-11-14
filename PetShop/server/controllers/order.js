import Order from "../models/order.js";
import OrderDetails from "../models/orderdetails.js";
import Product from "../models/product.js";
import Category from "../models/category.js";
import Brand from "../models/brand.js";
import Vendor from "../models/vendor.js";
import Payment from "../models/payment.js";
import { clearCacheByKeyword, getOrSetCachedData } from "./redis.js";

export const createOrder = async (req, res) => {
  // console.log(req.body);
  try {
    const newOrder = await Order.create(req.body);

    // clear cache data of orders
    await clearCacheByKeyword("orders");

    return res
      .status(201)
      .json({ doc: newOrder, message: "Order created successfully" });
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

export const getOrdersOfCustomer = async (req, res) => {
  const perPage = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;
  const { sort, status, search } = req.query;
  const { user_id } = req.params;

  try {
    // ✅ Define cache key uniquely per user and query params
    const cacheKey = `GET:/v1/orders/user/${user_id}?page=${page}&limit=${perPage}&sort=${
      sort || "none"
    }&status=${status || "all"}&search=${search || "none"}`;

    const result = await getOrSetCachedData(cacheKey, async () => {
      // --- Build filters ---
      const filter = { user: user_id };
      if (status && status !== "" && status !== "all") filter.status = status;
      if (search) filter._id = { _id: search };

      // --- Sorting options ---
      let sortOption = {};
      switch (sort) {
        case "price_asc":
          sortOption.totalPrice = 1;
          break;
        case "price_desc":
          sortOption.totalPrice = -1;
          break;
        case "latest":
          sortOption.createdAt = -1;
          break;
        case "oldest":
          sortOption.createdAt = 1;
          break;
        default:
          break;
      }

      // --- Query MongoDB ---
      const orders = await Order.find(filter)
        .sort(sortOption)
        .skip(perPage * (page - 1))
        .limit(perPage);

      const count = await Order.countDocuments(filter);

      if (!orders || orders.length === 0) {
        return { message: "No orders found" };
      }

      // --- Map data ---
      const data = orders.map((order) => ({
        _id: order._id,
        userId: order.user,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }));

      return {
        orders: data,
        current: page,
        pages: Math.ceil(count / perPage),
        total: count,
      };
    });

    // ✅ Return the cached or freshly fetched data
    if (result.message === "No orders found") {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error fetching customer orders:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getOrderDetails = async (req, res) => {
  const orderId = req.params.orderId;
  const perPage = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;

  // ✅ Unique cache key based on order + pagination
  const cacheKey = `GET:/v1/orders/${orderId}/orderDetails?page=${page}&limit=${perPage}`;

  try {
    const result = await getOrSetCachedData(cacheKey, async () => {
      // --- Fetch order details from DB ---
      const orderDetails = await OrderDetails.find({ order: orderId })
        .skip(perPage * (page - 1))
        .limit(perPage);

      if (!orderDetails || orderDetails.length === 0) {
        return { message: "No order details found" };
      }

      const count = await OrderDetails.countDocuments({ order: orderId });
      const pages = Math.ceil(count / perPage);
      const results = [];

      // --- Populate product info ---
      for (const item of orderDetails) {
        const product = await Product.findById(item.product);
        if (!product) continue;

        const [category, brand, vendor] = await Promise.all([
          Category.findById(product.category),
          Brand.findById(product.brand),
          Vendor.findById(product.vendor),
        ]);

        results.push({
          orderId,
          product: {
            _id: product._id || null,
            type: product.__t,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            status: product.status,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            category,
            vendor,
            brand,
          },
          quantity: item.quantity,
          totalPrice: product.price * item.quantity,
          note: item.note,
        });
      }

      return {
        results,
        page,
        pages,
        total: count,
      };
    });

    // ✅ Handle cache result
    if (result.message === "No order details found") {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error getting order details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateStatusOfOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    // console.log("orderId", orderId);
    const { status } = req.body;
    // console.log("status: ", status);
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure the updated fields follow schema validation
      }
    );
    if (!updateStatusOfOrder) {
      return res
        .status(400)
        .json({ message: "Order not found to update status" });
    }

    // clear cache data of orders
    await clearCacheByKeyword("orders");

    return res.status(200).json({
      doc: updatedOrder,
      message: "Order status updated successfully",
    });
  } catch {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getOrder = async (req, res) => {
  const { orderId } = req.params;
  const cacheKey = `GET:/v1/orders/${orderId}`;
  try {
    const order = await getOrSetCachedData(cacheKey, async () => {
      const data = await Order.findById(orderId);
      return data;
    });
    if (!order || order.length === 0)
      return res.status(400).json({ message: "Order not found" });
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
  }
};
