const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  image: String,
  name: String,
  description: String,
  new_price: String,
  old_price: String,
  category: String,
});

module.exports = mongoose.model("Items", itemSchema);
