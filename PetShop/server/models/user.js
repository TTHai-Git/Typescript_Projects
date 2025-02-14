const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String},
  password: { type: String},
  name: {type: String},
  avatar: {type: String},
  email: {type: String},
  phone: {type: String},
  address: {type: String}
});

const User = mongoose.model('User', userSchema);

module.exports= User
