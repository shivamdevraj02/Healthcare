const router = require("express").Router();
const { protect } = require("../middleware/auth");
const ctrl = require("../controllers/appointmentController");

// All routes below require logged-in user
router.use(protect);

router.post("/", ctrl.bookAppointment);
router.get("/", ctrl.listAppointments);
router.put("/:id/cancel", ctrl.cancelAppointment);

module.exports = router;