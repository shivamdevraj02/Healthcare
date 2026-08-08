const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, enum: ["video", "in-person"], default: "video" },
  reason: { type: String },
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
  
  // Financial Tracking fields
  fee: { type: Number, required: true }, // Total fee paid by patient (set by doctor)
  adminCommission: { type: Number, default: 0 }, // Admin's cut (e.g., 5% or fixed)
  doctorEarnings: { type: Number, default: 0 }, // Doctor's share (fee - commission)
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  paymentId: { type: String }, // Razorpay payment ID
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
