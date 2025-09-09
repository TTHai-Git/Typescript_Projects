import Shipment from "../models/shipment.js";

export const createShipment = async (req, res) => {
  try {
    // console.log(req.body);
    const shipment = await Shipment.create(req.body);
    return res.status(201).json({
      message:
        "Thông tin giao hàng đã được tạo thành công! Tiến hành thanh toán.",
      doc: shipment,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const caculateShipmentFee = async (req, res) => {
  try {
    const { distance, method } = req.body;

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
    const shippingFee = Math.ceil(rawFee / 1000) * 1000;

    return res.status(200).json({ shippingFee });
  } catch (error) {
    console.error("Error calculating shipment fee:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getShipmentOfOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const shipment = await Shipment.findOne({ order: orderId });

    if (!shipment) {
      return res.status(400).json({ message: "Shipment not found for Order" });
    }
    return res.status(200).json(shipment);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
