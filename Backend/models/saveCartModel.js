// models/SavedCart.js
import mongoose from "mongoose";

const SavedCartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
    required: true,
  },
  items: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
      price: { type: Number },
      quantity: { type: Number },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const SaveCartModel = mongoose.model("SavedCart", SavedCartSchema);

export default SaveCartModel;
