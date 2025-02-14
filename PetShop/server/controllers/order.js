const Order = require("../models/order.js")
const createOrder = async (req, res) => {
  try {
        const newOrder = await Order.create(req.body)
        res.status(201).json(newOrder)
  } catch {
    res.status(500).json({message: 'Error'})
  } 
}
module.exports = {
    createOrder
}