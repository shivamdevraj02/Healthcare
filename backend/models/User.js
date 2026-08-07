// Inside backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
    phone: { type: String, default: "" },
age: { type: Number, default: null },
gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    avatar: { type: String, default: "" },
    
    // Doctor-specific fields
    specialization: { type: String, default: "" },
    qualification: { type: String, default: "" },
    experienceYears: { type: Number, default: 0 },
    availability: [
      {
        day: { type: String },
        slots: [{ type: String }],
      },
    ],
    
    // Patient-specific quick fields
    bloodGroup: { type: String, default: "" },
    healthScore: { type: Number, default: 70 },
    isActive: { type: Boolean, default: true },
    
    // NEW: Handles the Doctor Approval Workflow
    approvalStatus: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "approved" 
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);