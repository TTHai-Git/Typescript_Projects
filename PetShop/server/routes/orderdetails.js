const express = require("express")
const {createOrderDetails} = require('../controllers/orderdetails')

const router = express.Router()
router.post('/', createOrderDetails)

module.exports = router