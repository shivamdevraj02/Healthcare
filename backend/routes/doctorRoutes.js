const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth");
const ctrl = require("../controllers/doctorController");

router.use(protect, authorize("doctor"));

router.get("/dashboard", ctrl.getDashboard);
router.get("/appointments", ctrl.getAppointments);
router.put("/appointments/:id", ctrl.updateAppointment);
router.get("/patients", ctrl.getPatients);
router.post("/prescriptions", ctrl.createPrescription);
router.get("/prescriptions", ctrl.getPrescriptions);
router.put("/availability", ctrl.updateAvailability);
router.put("/profile", ctrl.updateProfile);

module.exports = router;
