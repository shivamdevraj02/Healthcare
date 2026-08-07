const mongoose = require("mongoose");

// Generic record for water intake, sleep, BMI, diet-plan entries etc.
const healthRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["water", "sleep", "bmi", "diet", "activity"],
      required: true,
    },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthRecord", healthRecordSchema);
