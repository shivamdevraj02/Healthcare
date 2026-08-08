const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Appointment = require("../models/Appointment");
const { protect } = require("../middleware/auth"); // Fixed path to match auth.js

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Razorpay Order
router.post("/create-order", protect, async (req, res) => {
  try {
    const { amount, appointmentId } = req.body;
    const options = {
      amount: amount * 100, // Razorpay takes paise (e.g., 500 INR = 50000 paise)
      currency: "INR",
      receipt: `receipt_${appointmentId}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    res.status(500).json({ message: "Failed to create payment order", error: err.message });
  }
});

// 2. Verify Payment & Split Logic (Admin Commission vs Doctor Share)
router.post("/verify-payment", protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      // Calculate split: 5% Admin Commission, 95% Doctor Earnings
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });

      const totalFee = appointment.fee;
      const adminCommission = Math.round(totalFee * 0.05 * 100) / 100; // 5% fee for admin
      const doctorEarnings = totalFee - adminCommission;

      // Update appointment
      appointment.paymentStatus = "paid";
      appointment.paymentId = razorpay_payment_id;
      appointment.status = "confirmed";
      appointment.adminCommission = adminCommission;
      appointment.doctorEarnings = doctorEarnings;
      await appointment.save();

      return res.json({ success: true, message: "Payment verified successfully", appointment });
    } else {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (err) {
    res.status(500).json({ message: "Payment verification failed", error: err.message });
  }
});

module.exports = router;