const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth");
const ctrl = require("../controllers/patientController");
const { listDoctors } = require("../controllers/doctorController");

console.log("deleteMedicineReminder:", typeof ctrl.deleteMedicineReminder);
console.log("deleteVaccination:", typeof ctrl.deleteVaccination);
router.use(protect, authorize("patient"));

router.get("/dashboard", ctrl.getDashboard);
router.put("/profile", ctrl.updateProfile);

// Maintain Health
router.post("/health-record", ctrl.addHealthRecord);
router.get("/health-record", ctrl.getHealthRecords);

// Prevent Disease
router.post("/symptom-check", ctrl.checkSymptoms);
router.get("/symptom-check", ctrl.getSymptomHistory);

router.post("/medicine-reminder", ctrl.addMedicineReminder);
router.get("/medicine-reminder", ctrl.getMedicineReminders);
router.put("/medicine-reminder/:id", ctrl.updateMedicineReminder);
router.delete("/medicine-reminder/:id", ctrl.deleteMedicineReminder);

router.post("/vaccination", ctrl.addVaccination);
router.get("/vaccination", ctrl.getVaccinations);
router.put("/vaccination/:id", ctrl.updateVaccination);

// Treat Disease
router.get("/records", ctrl.getRecordsSummary);
router.get("/doctors", listDoctors);

router.delete("/vaccination/:id", ctrl.deleteVaccination);

module.exports = router;
