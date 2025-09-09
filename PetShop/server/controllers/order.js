import Order from "../models/order.js";
import OrderDetails from "../models/orderdetails.js";
import Product from "../models/product.js";
import Category from "../models/category.js";
import Brand from "../models/brand.js";
import Vendor from "../models/vendor.js";
import Payment from "../models/payment.js";

export const createOrder = async (req, res) => {
  // console.log(req.body);
  try {
    const newOrder = await Order.create(req.body);
    res
      .status(201)
      .json({ doc: newOrder, message: "Order created successfully" });
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

export const getOrdersOfCustomer = async (req, res) => {
  const perPage = parseInt(req.query.limt) || 5;
  const page = parseInt(req.query.page) || 1;
  const { sort } = req.query;
  try {
    const { user_id } = req.params;
    let sortOption = {};
    switch (sort) {
      case "price_asc":
        sortOption.totalPrice = 1;
        break;
      case "price_desc":
        sortOption.totalPrice = 2;
        break;
      case "lastest":
        sortOption.createdAt = -1;
        break;
      case "oldest":
        sortOption.createdAt = 1;
        break;
      default:
        break;
    }

    const orders = await Order.find({ user: user_id })
      .sort(sortOption)
      .skip(perPage * (page - 1))
      .limit(perPage);
    // console.log(orders);
    const count = await Order.find({ user: user_id }).countDocuments();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    const data = [];
    for (const order of orders) {
      data.push({
        orderId: order._id,
        userId: order.user,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      });
    }

    res.status(200).json({
      orders: data,
      current: page,
      pages: Math.ceil(count / perPage),
      total: count,
    });
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

export const getOrderDetails = async (req, res) => {
  const orderId = req.params.orderId;

  const perPage = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;

  try {
    const orderDetails = await OrderDetails.find({ order: orderId })
      .skip(perPage * (page - 1))
      .limit(perPage);

    if (!orderDetails || orderDetails.lenght === 0) {
      return res.status(404).json({ message: "No order details found" });
    }
    // console.log(orderDetails)

    const count = await OrderDetails.countDocuments({ order: orderId });
    const pages = Math.ceil(count / perPage);
    const results = [];

    for (const item of orderDetails) {
      const product = await Product.findById(item.product);
      const category = await Category.findById(product.category);
      const brand = await Brand.findById(product.brand);
      const vendor = await Vendor.findById(product.vendor);
      if (product) {
        results.push({
          orderId: orderId,
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
    }

    res.status(200).json({
      results,
      page,
      pages,
      total: count,
    });
  } catch (error) {
    console.error("Error getting order details:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateStatusOfOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("orderId", orderId);
    const { status } = req.body;
    console.log("status: ", status);
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
    return res.status(200).json({
      doc: updatedOrder,
      message: "Order status updated successfully",
    });
  } catch {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(400).json({ message: "Order not found" });
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
  }
};
