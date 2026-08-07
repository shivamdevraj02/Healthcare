const mongoose = require("mongoose");

const symptomCheckSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symptoms: [{ type: String }],
    possibleConditions: [{ type: String }],
    riskLevel: { type: String, enum: ["low", "medium", "high"], default: "low" },
    advice: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SymptomCheck", symptomCheckSchema);
