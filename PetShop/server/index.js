const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

//middleware
app.use(express.urlencoded({ extended: false })); // request with form data
app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/v1/dogs", require("./routes/dog.js"));
app.use("/api/auth", require("./routes/auth.js"));
app.use("/v1/orders", require("./routes/order.js"));
app.use("/v1/orderDetails", require("./routes/orderdetails.js"));

app.use(express.json());
const port = 8080;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Replace <username> and <password> with your actual MongoDB Atlas credentials
mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((error) =>
    console.error("Error connecting to MongoDB:", error.message)
  );
