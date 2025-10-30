import OrderDetails from "../models/orderdetails.js";
import { clearCacheByKeyword } from "./redis.js";

export const createOrderDetails = async (req, res) => {
  try {
    const newOrderDetails = req.body.data;

    if (!Array.isArray(newOrderDetails)) {
      return res.status(400).json({ message: "Request body must be an array" });
    }

    const createdOrderDetails = await Promise.all(
      newOrderDetails.map(async (item) => {
        const newOrderDetail = await OrderDetails.create(item);
        return newOrderDetail;
      })
    );

    // clear cache data of orders
    // await clearCacheByKeyword("orderDetails");

    res.status(201).json({
      doc: createdOrderDetails,
      message: "Order details created successfully",
    });
  } catch (error) {
    console.error("Error creating order details:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
