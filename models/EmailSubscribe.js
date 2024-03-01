const mongoose = require("mongoose");

const cartItemsSchema = new mongoose.Schema({
  email: String,
});

module.exports = mongoose.model("EmailSubScribes", cartItemsSchema);
