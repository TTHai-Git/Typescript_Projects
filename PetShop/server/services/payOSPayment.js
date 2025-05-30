import PayOS from "@payos/node";
import dotenv from "dotenv";
import { Router } from "express";
import Order from "../models/order.js";
dotenv.config();

const payos = new PayOS(
  process.env.REACT_APP_PAYOS_x_client_id,
  process.env.REACT_APP_PAYOS_x_api_key,
  process.env.REACT_APP_PAYOS_checksum_key
);
const payOSRouter = Router();
payOSRouter.post("/create-payment-link", async (req, res) => {
  const {
    orderId,
    amount,
    items,
    buyerName,
    buyerEmail,
    buyerPhone,
    buyerAddress,
  } = req.body;
  const countOrder = await Order.countDocuments();
  try {
    const order = {
      orderCode: countOrder + 1,
      buyerName: buyerName,
      buyerEmail: buyerEmail,
      buyerPhone: buyerPhone,
      buyerAddress,
      buyerAddress,
      amount: amount,
      description: "Thanh Toan Dog Shop",
      items: items,
      returnUrl: `http://localhost:3000/PAYOS/payment-return?order=${orderId}`,
      cancelUrl: `http://localhost:3000/PAYOS/payment-return?order=${orderId}`,
      expiredAt: Math.floor(Date.now() / 1000) + 15 * 60,
    };
    const paymentLink = await payos.createPaymentLink(order);
    // res.redirect(303, paymentLink.checkoutUrl);
    return res.status(201).json(paymentLink);
  } catch (error) {
    console.log(error);
  }
});
payOSRouter.get("/get-payment-link-info/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const paymentLinkInfo = await payos.getPaymentLinkInformation(id);
    return res.status(200).json(paymentLinkInfo);
  } catch (error) {
    console.log(error);
  }
});

export default payOSRouter;
