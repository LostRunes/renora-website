const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  name: String,
  price: Number,
  type: String,
  material: String,
  description: String,

  image: {
    type: String,
    default: ""
  }

});

module.exports = mongoose.model("Product", productSchema);