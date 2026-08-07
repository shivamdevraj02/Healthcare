const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth");
const ctrl = require("../controllers/adminController");

router.use(protect, authorize("admin"));

router.get("/dashboard", ctrl.getDashboard);
router.get("/users", ctrl.getUsers);
router.put("/users/:id", ctrl.updateUser);
router.delete("/users/:id", ctrl.deleteUser);
router.get("/doctors", ctrl.getDoctors);
router.get("/appointments", ctrl.getAppointments);
router.get("/reports", ctrl.getReports);

module.exports = router;
