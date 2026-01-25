import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    message: { type: String },

    amount: { type: Number, required: true },
    paymentStatus: { type: String, default: "PAID" },

    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
