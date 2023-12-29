const mongoose = require("mongoose");

const shopperRegister = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("ShopperUser", shopperRegister);
