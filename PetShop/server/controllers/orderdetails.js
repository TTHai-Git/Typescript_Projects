const OrderDetails = require("../models/orderdetails");

const createOrderDetails = async (req, res) => {
    try {
        const newOrderDetails = req.body.data;
        // console.log(newOrderDetails)

        if (!Array.isArray(newOrderDetails)) {
            return res.status(400).json({ message: "Request body must be an array" });
        }

        const createdOrderDetails = await Promise.all(
            newOrderDetails.map(async (item) => {
                // console.log(item);
                const newOrderDetail = await OrderDetails.create(item);
                return newOrderDetail;
            })
        );

        res.status(201).json(createdOrderDetails);
    } catch (error) {
        console.error("Error creating order details:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    createOrderDetails
};