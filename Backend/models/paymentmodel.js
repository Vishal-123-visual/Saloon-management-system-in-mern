import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    customer :{
      type : mongoose.Schema.Types.ObjectId,
      ref : "customer",
      required : true
    },
    items: [
      {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
        name: { type: String },          // fallback if service removed
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountType: {
      type: String,
      enum: ["%", "₹"],
      default: "%",
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["cash", "card", "online"],
      default: "cash",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin/Staff who saved this payment
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const paymentmodel=  mongoose.model("Payment", PaymentSchema);

export default paymentmodel
