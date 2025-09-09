import OrderDetails from "../models/orderdetails.js";
import Payment from "../models/payment.js";
import { updateStock } from "./product.js";

export const createPaymentForOrder = async (req, res) => {
  const newPayment = await Payment.create(req.body);

  // handle update Stock Of Products
  const orderDetails = await OrderDetails.find({ order: req.body.order });
  for (const orderDetail of orderDetails) {
    updateStock(orderDetail.product, orderDetail.quantity);
  }
  return res
    .status(201)
    .json({ doc: newPayment, message: "Payment created successfully" });
};

export const getPaymentForOrder = async (req, res) => {
  const { orderId } = req.params;
  const payment = await Payment.findOne({ order: orderId });
  if (!payment) {
    return res.status(400).json({ message: "Payment not found for Order" });
  }
  return res.status(200).json({
    _id: payment._id,
    method: payment.method,
    provider: payment.provider,
    status: payment.status,
    order: payment.order,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  });
};

export const getPaymentDetailsForOrder = async (req, res) => {
  const { paymentId } = req.params;
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return res.status(400).json({ message: "Payment not found for Order" });
  }
  return res.status(200).json(payment);
};
