import Voucher from "../models/voucher.js";
import moment from "moment-timezone";

export const createVoucher = async (req, res) => {
  try {
    let { expiryDate, ...rest } = req.body;

    // If expiryDate is in format dd/MM/YYYY HH:mm:ss
    if (expiryDate) {
      // Parse as Vietnam local time (UTC+7)
      expiryDate = moment
        .tz(expiryDate, "DD/MM/YYYY - HH:mm:ss", "Asia/Ho_Chi_Minh")
        .toDate();
    }

    const voucher = await Voucher.create({
      ...rest,
      expiryDate, // this is now a JS Date (stored in UTC)
    });

    res.status(201).json(voucher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createManyVouchers = async (req, res) => {
  try {
    let vouchers = req.body;

    if (!Array.isArray(vouchers)) {
      return res
        .status(400)
        .json({ message: "Body must be an array of vouchers" });
    }

    // Convert each expiryDate string to Date in UTC
    vouchers = vouchers.map((v) => {
      if (v.expiryDate) {
        v.expiryDate = moment
          .tz(v.expiryDate, "DD/MM/YYYY - HH:mm:ss", "Asia/Ho_Chi_Minh")
          .toDate();
      }
      return v;
    });

    // insertMany for bulk creation
    const saved = await Voucher.insertMany(vouchers);

    res.status(201).json({
      message: `${saved.length} vouchers created successfully`,
      data: saved,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteVoucher = async (req, res) => {
  const { voucherId } = req.params;
  try {
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found to delete" });
    }
    await voucher.deleteOne();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateVoucher = async (req, res) => {
  const { voucherId } = req.params;

  try {
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      voucherId,
      req.body,
      { new: true }
    );

    if (!updatedVoucher) {
      return res.status(404).json({ message: "Voucher not found to update" });
    }

    const now = new Date();
    if (
      updatedVoucher.usageCount >= updatedVoucher.maxUsage ||
      now >= updatedVoucher.expiryDate
    ) {
      updatedVoucher.isActive = false;
      await updatedVoucher.save();
    }

    return res.status(200).json(updatedVoucher);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateVoucherUsageForUser = async (req, res) => {
  const { voucherId } = req.params;

  try {
    const voucher = await Voucher.findById(voucherId);

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    const now = new Date();

    // Check if already inactive or expired before increment
    if (!voucher.isActive || now >= voucher.expiryDate) {
      return res.status(400).json({ message: "Voucher is no longer valid" });
    }

    voucher.usageCount += 1;

    if (voucher.usageCount >= voucher.maxUsage) {
      voucher.isActive = false;
    }

    await voucher.save();
    return res.status(200).json(voucher);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getVoucher = async (req, res) => {
  const { voucherId } = req.params;
  try {
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ message: "voucher not found" });
    }
    return res.status(200).json(voucher);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAvailableVouchersForOrders = async (req, res) => {
  const totalOfCart = Number(req.query.totalOfCart);
  if (isNaN(totalOfCart)) {
    return res.status(400).json({ message: "Invalid tempTotal" });
  }

  try {
    const availableVouchers = await Voucher.find({
      minimumPrice: { $lte: totalOfCart },
      isActive: true,
      type: "Order",
      $expr: { $lt: ["$usageCount", "$maxUsage"] },
      expiryDate: { $gte: new Date() }, // current time in UTC
    });

    return res.status(200).json(availableVouchers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getAvailableVouchersForShipment = async (req, res) => {
  const shipmentFee = Number(req.query.shipmentFee);
  if (isNaN(shipmentFee)) {
    return res.status(400).json({ message: "Invalid shipmentFee" });
  }

  try {
    const availableVouchers = await Voucher.find({
      minimumPrice: { $lte: shipmentFee },
      isActive: true,
      type: "Shipment",
      $expr: { $lt: ["$usageCount", "$maxUsage"] },
      expiryDate: { $gte: new Date() }, // current time in UTC
    });

    return res.status(200).json(availableVouchers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
