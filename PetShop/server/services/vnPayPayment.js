import express from "express";
import crypto from "crypto";
import querystring from "qs";
import moment from "moment";
import dotenv from "dotenv";

const VNPayRouter = express.Router();
dotenv.config();

const vnp_TmnCode = process.env.REACT_APP_vnp_TmnCode;
const vnp_HashSecret = process.env.REACT_APP_vnp_HashSecret;
const vnp_Url = process.env.REACT_APP_vnp_Url;
const vnp_ReturnUrl = process.env.REACT_APP_vnp_Return_Url;

const getVNPayFormattedDate = () => moment().format("YYYYMMDDHHmmss");

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  });
  return sorted;
}

VNPayRouter.post("/create-payment-url", (req, res) => {
  const { amount, orderId, bankCode } = req.body;
  const ipAddr = req.headers["x-forwarded-for"]
    ? req.headers["x-forwarded-for"].split(",")[0].trim()
    : req.connection.remoteAddress;

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode,
    vnp_Amount: amount * 100,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Payment for Order ${orderId}`,
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: getVNPayFormattedDate(),
  };

  if (bankCode) vnp_Params["vnp_BankCode"] = bankCode;

  vnp_Params = sortObject(vnp_Params);
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(signData).digest("hex");
  vnp_Params.vnp_SecureHash = signed;

  const paymentUrl = `${vnp_Url}?${querystring.stringify(vnp_Params, {
    encode: false,
  })}`;
  res.json({ paymentUrl });
});

export default VNPayRouter;
