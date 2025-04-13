import Order from "../models/order.js";
import OrderDetails from "../models/orderdetails.js";
import Product from "../models/product.js";
import Category from "../models/category.js";

export const createOrder = async (req, res) => {
  console.log(req.body);
  try {
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

export const getOrdersOfCustomer = async (req, res) => {
  const perPage = 5;
  const page = parseInt(req.params.page) || 1;
  try {
    const { user_id } = req.params;

    const orders = await Order.find({ user: user_id })
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

  const perPage = 5;
  const page = parseInt(req.params.page) || 1;

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
      if (product) {
        results.push({
          orderId: orderId,
          product: product,
          category: category,
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
