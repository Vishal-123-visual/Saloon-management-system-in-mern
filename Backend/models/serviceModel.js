

import mongoose, { Schema } from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref : "category",
      required: true,
      index: true, // Faster category-based queries
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      default: 0,
      validate: {
        validator: function (value) {
          // Discount cannot be higher than price
          return value <= this.price;
        },
        message: "Discount price must be less than or equal to original price",
      },
    },
    duration: {
      type: String, // duration in minutes
      required: [true, "Duration is required"],
      min: [5, "Duration must be at least 5 minutes"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

// ✅ Virtual field for calculating final price
serviceSchema.virtual("finalPrice").get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

// ✅ Indexes (helps in searching & filtering)
serviceSchema.index({ name: "text", description: "text" });

const Services = mongoose.model("Service", serviceSchema);

export default Services;
