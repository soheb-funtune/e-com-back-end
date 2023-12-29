const mongoose = require("mongoose");

const cartItemsSchema = new mongoose.Schema(
  {
    user_id: String,
    product_id: String,
    sizes: String,
    quantity: Number,
    image: String,
    name: String,
    description: String,
    new_price: String,
    old_price: String,
  }
  // { _id: false }
);

module.exports = mongoose.model("CartItems", cartItemsSchema);
