import OrderDetails from "../models/orderdetails.js";
import Payment from "../models/payment.js";
import { updateStock } from "./product.js";
import { clearCacheByKeyword, getOrSetCachedData } from "./redis.js";

export const createPaymentForOrder = async (req, res) => {
  const newPayment = await Payment.create(req.body);

  // handle update Stock Of Products
  const orderDetails = await OrderDetails.find({ order: req.body.order });
  for (const orderDetail of orderDetails) {
    updateStock(orderDetail.product, orderDetail.quantity);
  }

  // clear cache data of payments
  await clearCacheByKeyword("payments");

  return res
    .status(201)
    .json({ doc: newPayment, message: "Payment created successfully" });
};

export const getPaymentForOrder = async (req, res) => {
  const { orderId } = req.params;

  // ✅ Unique cache key per order
  const cacheKey = `GET:/v1/payments/order/${orderId}`;

  try {
    const result = await getOrSetCachedData(cacheKey, async () => {
      const payment = await Payment.findOne({ order: orderId });

      if (!payment) {
        return { message: "Payment not found for Order" };
      }

      return {
        _id: payment._id,
        method: payment.method,
        provider: payment.provider,
        status: payment.status,
        order: payment.order,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      };
    });

    if (result.message === "Payment not found for Order") {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error fetching payment for order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPaymentDetailsForOrder = async (req, res) => {
  const { paymentId } = req.params;
  const cacheKey = `GET:/v1/payments/${paymentId}`;
  try {
    const payment = await getOrSetCachedData(cacheKey, async () => {
      const data = await Payment.findById(paymentId);
      return data;
    });
    if (!payment || payment.length === 0)
      return res.status(400).json({ message: "Payment not found for Order" });

    return res.status(200).json(payment);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Server Error ${error}` });
  }
};
