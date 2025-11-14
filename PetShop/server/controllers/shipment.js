import Shipment from "../models/shipment.js";
import { getOrSetCachedData } from "./redis.js";
import { calculateDiscountPrice } from "./vendor.js";

export const createShipment = async (req, res) => {
  try {
    // console.log(req.body);
    const shipment = await Shipment.create(req.body);

    //clear data of shipments
    await clearCacheByKeyword("shipments");

    return res.status(201).json({
      message:
        "Delivery information has been successfully created! Proceed to payment.",
      doc: shipment,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const caculateShipmentFee = async (req, res) => {
  try {
    const { distance, method, discount } = req.body;

    if (method !== "Delivery") {
      return res.status(200).json({ shippingFee: 0 });
    }

    if (typeof distance !== "number" || distance < 0) {
      return res.status(400).json({ message: "Invalid distance value" });
    }

    // Base calculation
    const baseFee = 10000; // 10,000 VND
    const ratePerKm = 5000; // 5,000 VND per km
    const rawFee = baseFee + ratePerKm * distance;

    // Round up to nearest thousand
    // Round base fee first
    let shippingFee = Math.ceil(rawFee / 1000) * 1000;

    // Apply discount to get final shipping fee
    shippingFee = calculateDiscountPrice(shippingFee, discount);

    return res.status(200).json({ shippingFee });
  } catch (error) {
    console.error("Error calculating shipment fee:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getShipmentOfOrder = async (req, res) => {
  const { orderId } = req.params;
  const cacheKey = `GET:/v1/shipments/order/${orderId}`;

  try {
    const shipment = await getOrSetCachedData(cacheKey, async () => {
      const data = await Shipment.findOne({ order: orderId });
      return data;
    });

    if (!shipment) {
      return res.status(400).json({ message: "Shipment not found for Order" });
    }
    return res.status(200).json(shipment);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
