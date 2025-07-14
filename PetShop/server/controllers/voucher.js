import Voucher from "../models/voucher.js";

export const createVoucher = async (req, res) => {
    const {code, discount, expiryDate, isActive, usageCount, maxUsage} = req.body
    try {
        const newVoucher = new Voucher({
            code,
            discount,
            expiryDate,
            isActive,
            usageCount,
            maxUsage,
        })
        return res.status(201).json(newVoucher)
    } catch (error) {
        return res.status(500).json({ message: "Internal server error"})
    }
}

export const deleteVoucher = async (req, res) => {
    const { voucherId } = req.params;
    try {
        const voucher = await Voucher.findByIdAndDelete(voucherId)
        if(!voucher) {
            return res.status(404).json({ message: "Voucher not found to delete"})
        }
        return res.status(204).json({ message: "Voucher deleted successfully"})
    } catch (error) {
        return res.status(500).json({ message: "Internal server error"})
    }
}

export const updateVoucher = async (req, res) => {
    const { voucherId } = req.params;
    try {
        const { code, discount, expiryDate, isActive, usageCount, maxUsage } = req.body;
        const voucher = await Voucher.findByIdAndUpdate(voucherId, {
            code,
            discount,
            expiryDate,
            isActive,
            usageCount,
            maxUsage
        }, { new: true });

        if(!voucher) {
            return res.status(404).json({ message: "Voucher not found to update"})
        }
        return res.status(200).json(voucher)
    } catch (error) {
        return res.status(500).json({ message: "Internal server error"})
    }
}

export const getVoucher = async (req, res) => {
    const { voucherId} = req.params;
    try {
        const voucher = await Voucher.findById(voucherId)
        if(!voucher) {
            return res.status(404).json({ message: "voucher not found"})
        }
        return res.status(200).json(voucher)
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error"})
    }
}