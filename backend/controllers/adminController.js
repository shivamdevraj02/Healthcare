const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const { createNotification } = require("../utils/notificationHelper");

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const pendingDoctors = await User.countDocuments({ role: "doctor", approvalStatus: "pending" });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: "pending" });
    const completedAppointments = await Appointment.countDocuments({ status: "completed" });

    res.json({
      totalPatients,
      totalDoctors,
      pendingDoctors,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/users?role=patient
exports.getUsers = async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
  res.json(users);
};

// PUT /api/admin/users/:id  (activate/deactivate, edit role)
exports.updateUser = async (req, res) => {
  try {
    const allowed = ["isActive", "role", "name", "phone", "approvalStatus"];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    if (updates.approvalStatus && !["pending", "approved", "rejected"].includes(updates.approvalStatus)) {
      delete updates.approvalStatus;
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");

    if (updatedUser?.role === "doctor" && updates.approvalStatus) {
      const notificationMessage = {
        approved: "Your doctor account has been approved. You can now log in.",
        rejected: "Your doctor account was rejected by the admin.",
        pending: "Your doctor account has been moved back to pending review.",
      }[updates.approvalStatus];

      if (notificationMessage) {
        await createNotification(updatedUser._id, "Approval update", notificationMessage, "info");
      }
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

// GET /api/admin/doctors
exports.getDoctors = async (req, res) => {
  const doctors = await User.find({ role: "doctor" }).select("-password").sort({ createdAt: -1 });
  res.json(doctors);
};

// GET /api/admin/appointments
exports.getAppointments = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const appointments = await Appointment.find(filter)
    .populate("patient", "name email")
    .populate("doctor", "name specialization")
    .sort({ date: -1 });
  res.json(appointments);
};

// GET /api/admin/reports  -> basic analytics for charts
exports.getReports = async (req, res) => {
  try {
    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const usersByRole = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);

    const last6Months = new Date();
    last6Months.setMonth(last6Months.getMonth() - 6);
    const appointmentsOverTime = await Appointment.aggregate([
      { $match: { createdAt: { $gte: last6Months } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({ appointmentsByStatus, usersByRole, appointmentsOverTime });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
