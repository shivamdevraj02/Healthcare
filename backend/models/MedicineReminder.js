const mongoose = require("mongoose");

const medicineReminderSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    medicineName: { type: String, required: true },
    dosage: { type: String, default: "" },
    times: [{ type: String }], // e.g. ["08:00","20:00"]
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    active: { type: Boolean, default: true },
    date: { type: Date, default: null },        // specific date jab dawa leni hai (optional)
    lastNotifiedDate: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicineReminder", medicineReminderSchema);
