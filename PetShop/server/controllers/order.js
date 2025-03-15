const Dog = require("../models/dog.js")
const Order = require("../models/order.js")
const OrderDetails = require("../models/orderdetails.js")
const createOrder = async (req, res) => {
  try {
        const newOrder = await Order.create(req.body)
        res.status(201).json(newOrder)
  } catch {
    res.status(500).json({message: 'Error'})
  } 
}

const getOrdersOfCustomer = async (req, res) => {
  const perPage = 5; 
  const page = parseInt(req.params.page) || 1;
  try {
    const {user_id} = req.params
    // console.log(user_id)
    const orders = await Order.find({user: user_id}).skip((perPage * (page - 1))).limit(perPage);
    const count = await Order.find({user: user_id}).countDocuments();
    // console.log(orders)
    res.status(200).json({
      orders,
      current: page,
      pages: Math.ceil(count / perPage),
      total: count
    })
  } catch {
    res.status(500).json({message: 'Error'})
  }
}

const getOrderDetails = async (req, res) => {
  const orderId  = req.params.orderId;
  const perPage = 5;
  const page = parseInt(req.params.page) || 1;


  try {
      const orderDetails = await OrderDetails.find({ order: orderId }).skip((perPage * (page - 1))).limit(perPage);
      const count = await OrderDetails.countDocuments({ order: orderId });
      const pages = Math.ceil(count / perPage);
      const results = [];
      let index = 1;

      for (const item of orderDetails) {
          const dog = await Dog.findById(item.dog);
          if (dog) {
              results.push({
                  "STT": index++,
                  "DogName": dog.name,
                  "DogBreed": dog.breed,
                  "DogDescription": dog.description,
                  "DogImageUrl": dog.imageUrl,
                  "Quantity": item.quantity,
                  "DogPrice": dog.price,
                  "totalPrice": dog.price * item.quantity,
              });
          }
      }

      res.status(200).json({
          results,
          page,
          pages,
          total: count,
      });
  } catch (error) {
      console.error("Error getting order details:", error);
      res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
    createOrder,
    getOrdersOfCustomer,
    getOrderDetails,
}