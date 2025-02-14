const mongoose = require('mongoose');

const OrderDetailsSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Reference to Order
  dog: { type: mongoose.Schema.Types.ObjectId, ref: 'Dog', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const OrderDetails = mongoose.model('OrderDetails', OrderDetailsSchema);
module.exports = OrderDetails;
