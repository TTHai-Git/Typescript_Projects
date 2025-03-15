const express = require("express")
const {createOrder, getOrdersOfCustomer, getOrderDetails} = require('../controllers/order.js')

const router = express.Router()
router.post('/', createOrder)
router.get('/:user_id/:page', getOrdersOfCustomer)
router.get('/:orderId/orderDetails/:page', getOrderDetails)

module.exports = router