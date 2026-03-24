const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },

  image: {
    data: Buffer,
    contentType: String,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Items", itemsSchema);