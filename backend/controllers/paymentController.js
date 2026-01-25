import Razorpay from "razorpay";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Booking from "../models/Booking.js";


console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID ? "Loaded ✅" : "Missing ❌" );
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET ? "Loaded ✅" : "Missing ❌");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Email transporter using your ENV
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ✅ Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { amount, formData } = req.body;

    if (!amount || !formData?.name || !formData?.email || !formData?.phone) {
      return res.status(400).json({ success: false, message: "Invalid form data" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Create Order Error:", err);
    return res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

// ✅ Verify Payment + Save Booking + Send Email
export const verifyPayment = async (req, res) => {
  try {
    const { response, formData, amount } = req.body;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    // ✅ Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // ✅ Payment verified -> Save booking in DB
    const booking = await Booking.create({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      message: formData.message,
      amount,
      paymentStatus: "PAID",
      razorpay_order_id,
      razorpay_payment_id,
    });

    // ✅ Email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: "Payment Successful - Booking Confirmed",
      html: `
        <h2>Payment Successful ✅</h2>
        <p>Hi ${formData.name},</p>
        <p>Your booking is confirmed.</p>
        <p><b>Service:</b> ${formData.service}</p>
        <p><b>Amount Paid:</b> ₹${amount}</p>
        <p>We will contact you shortly.</p>
      `,
    });

    // ✅ Email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Paid Booking Received",
      html: `
        <h2>New Paid Booking</h2>
        <p><b>Name:</b> ${formData.name}</p>
        <p><b>Email:</b> ${formData.email}</p>
        <p><b>Phone:</b> ${formData.phone}</p>
        <p><b>Service:</b> ${formData.service}</p>
        <p><b>Message:</b> ${formData.message || "-"}</p>
        <p><b>Paid:</b> ₹${amount}</p>
      `,
    });

    return res.json({
      success: true,
      message: "Payment verified and booking confirmed",
      booking,
    });
  } catch (err) {
    console.error("Verify Payment Error:", err);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};
