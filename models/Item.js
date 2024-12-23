const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock_quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img_url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("itemSchema", itemSchema);
