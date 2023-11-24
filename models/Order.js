const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, require: true },
    customerId: { type: String, require: true },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    quantity: { type: Number, require: true },
    total: { type: String, require: true },
    delivery_status: { type: String, require: true, default: "pending" },
    payment_status: { type: String, require: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", OrderSchema);
