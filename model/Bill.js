const mongoose = require("mongoose");

const BillItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String },
  model: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

const BillSchema = new mongoose.Schema(
  {
    // ✅ BILL NUMBER
    billNumber: { type: String, unique: true },

    items: [BillItemSchema],

    discountPercent: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    netAmount: { type: Number, required: true },

    payment: {
      cash: { type: Number, default: 0 },
      upi: { type: Number, default: 0 },
    },

    visitTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", BillSchema);