import Payment from "../models/payment.js";

export const createPaymentForOrder = async (req, res) => {
  const newPayment = await Payment.create(req.body);
  return res.status(201).json(newPayment);
};
