import mongoose from "mongoose";

const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    customer: {
      name: { type: String, required: true },
      phone: { type: Number, required: true },
      email: { type: String },
      notes: { type: String },
    },
    serviceId: { type: Schema.Types.ObjectId, ref: "Services", required: true },
    staffId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    start: { type: Date, required: true },
    end: {
      type: Date,
      required: true,
    },
    servicePrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["booked", "completed", "canceled", "no-show"],
      default: "booked",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// avoid exact duplicate (same staff, same start time)
appointmentSchema.index({ staffId: 1, start: 1 }, { unique: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
