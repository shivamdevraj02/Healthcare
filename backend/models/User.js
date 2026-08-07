// Inside backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["patient", "doctor", "admin"], required: true },
    phone: { type: String },
    
    // Doctor Specific Fields
    specialization: { type: String },
    qualification: { type: String },
    experienceYears: { type: Number, default: 0 },
    consultationFee: { 
      type: Number, 
      default: 500 // Admin-controlled standard fee for consultations
    },
    approvalStatus: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: function() {
        return this.role === "doctor" ? "pending" : "approved";
      } 
    },
    availability: [
      {
        day: { type: String },
        slots: [{ type: String }],
      },
    ],

    // Patient Specific Fields
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    bloodGroup: { type: String },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);