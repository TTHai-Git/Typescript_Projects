const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser')
const Dog = require('./models/dog.model.js');
require ("dotenv").config()
const app = express();

//middleware
app.use(express.urlencoded({ extended: false }));// request with form data
app.use(cors());
app.use(bodyParser.json());

// routes
app.use('/v1/dogs', require('./routes/dog.route.js'));
app.use('/api/auth', require('./routes/auth.route.js'))

app.use(express.json());
const port = 8080;

const dataUsers  = [
    {
        id: 1,
        name: "guest",
        avatar: "https://res.cloudinary.com/dh5jcbzly/image/upload/v1726378556/ckuhcznrq7xexwibulcm.jpg",
        email: "guest@gmail.com",
        address: "guest address",
        phone: "123456789",
        username: "guest_user",
        password: "123456",
    },
    {
      id: 2,
      name: "admin",
      email: "admin@gmail.com",
      avatar: "https://res.cloudinary.com/dh5jcbzly/image/upload/v1728208177/eaupfjyh0s8fft2tlzex.jpg",
      address: "admin address",
      phone: "987654321",
      username: "admin_user",
      password: "123456",
    },
    {
      id: 3,
      name: "staff",
      email: "staff@gmail.com",
      avatar: "https://res.cloudinary.com/dh5jcbzly/image/upload/v1728288560/hppxgbulitspzzqbo24y.png",
      address: "staff address",
      phone: "123456789",
      username: "staff_user",
      password: "123456",
    },
]




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Replace <username> and <password> with your actual MongoDB Atlas credentials
mongoose.connect(`${process.env.MONGO_URI}`)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((error) => console.error('Error connecting to MongoDB:', error.message));

