import OrderDetails from "../models/orderdetails.js";
import Payment from "../models/payment.js";
import Comment from "../models/comment.js";
import { getOrSetCachedData } from "./redis.js";

export const revenueStatistics = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // ✅ Endpoint-based cache key
    const cacheKey = `GET:/v1/stats/revenue?year=${year}`;

    // Use cache helper
    const result = await getOrSetCachedData(cacheKey, async () => {
      const stats = await Payment.aggregate([
        {
          $match: { status: "PAID" }, // only paid payments
        },
        {
          $lookup: {
            from: "orders",
            localField: "order",
            foreignField: "_id",
            as: "orderData",
          },
        },
        { $unwind: "$orderData" },
        {
          $match: {
            "orderData.createdAt": {
              $gte: new Date(`${year}-01-01`),
              $lt: new Date(`${year + 1}-01-01`),
            },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$orderData.createdAt" } },
            totalRevenue: { $sum: "$orderData.totalPrice" },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            totalRevenue: 1,
            totalOrders: 1,
          },
        },
        { $sort: { month: 1 } },
      ]);

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const data = monthNames.map((name, index) => {
        const stat = stats.find((s) => s.month === index + 1);
        return {
          index: index + 1,
          month: name,
          revenue: stat ? stat.totalRevenue : 0,
          orders: stat ? stat.totalOrders : 0,
        };
      });

      return { year, data };
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating revenue stats:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getBestSellingProducts = async (req, res) => {
  try {
    const cacheKey = `GET:/v1/stats/best-selling-products`;
    const bestSellers = await getOrSetCachedData(cacheKey, async () => {
      const result = await OrderDetails.aggregate([
        // Join with orders
        {
          $lookup: {
            from: "orders",
            localField: "order",
            foreignField: "_id",
            as: "order",
          },
        },
        { $unwind: "$order" },

        // Join with payments
        {
          $lookup: {
            from: "payments",
            localField: "order._id",
            foreignField: "order",
            as: "payment",
          },
        },
        { $unwind: "$payment" },

        // Keep only successful payments
        {
          $match: {
            "payment.status": "PAID", // 👈 adjust field if you use another value
          },
        },

        // Group by product
        {
          $group: {
            _id: "$product",
            totalSold: { $sum: "$quantity" },
            totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } },
          },
        },

        {
          $match: { totalRevenue: { $gt: 0 } },
        },

        // Lookup product details
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },

        // Sort by best-selling
        { $sort: { totalRevenue: -1 } },

        // Limit to top 10
        { $limit: 10 },

        // Clean response
        {
          $project: {
            _id: 0,
            productId: "$product._id",
            name: "$product.name",
            imageUrl: "$product.imageUrl",
            totalSold: 1,
            totalRevenue: 1,
          },
        },
      ]);
      return result;
    });

    return res.status(200).json(bestSellers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getListOfMostPopularProducts = async (req, res) => {
  const cacheKey = `GET:/v1/stats/most-popular-products`;
  try {
    const mostPopularProducts = await getOrSetCachedData(cacheKey, async () => {
      const result = await Comment.aggregate([
        {
          // Group comments by product
          $group: {
            _id: "$product", // foreign key to Product
            averageRating: { $avg: "$rating" },
            totalComments: { $sum: 1 },
          },
        },
        {
          // Only keep products with at least 1 rating > 0
          $match: { averageRating: { $gt: 0 } },
        },
        {
          // Lookup product details
          $lookup: {
            from: "products", // collection name in MongoDB
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          // Shape the output
          $project: {
            _id: 0,
            productName: "$product.name",
            averageRating: { $round: ["$averageRating", 1] }, // round to 1 decimal
            totalComments: 1,
          },
        },
        {
          // Sort by rating desc
          $sort: { averageRating: -1 },
        },

        // Limit to top 10
        { $limit: 10 },
      ]);
      return result;
    });

    return res.status(200).json(mostPopularProducts);
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
