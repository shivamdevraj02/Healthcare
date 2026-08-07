const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");
const User = require("../models/User");

// POST /api/appointments (Patient books an appointment)
// POST /api/appointments (Patient books an appointment)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctor, date, time, type, reason, fee } = req.body;
    if (!doctor || !date || !time) {
      return res
        .status(400)
        .json({ message: "doctor, date and time are required" });
    }

    // 1. Calculate 3-way split or use provided fee
    const consultationFee = fee || 500;
    const adminCommission = Math.round(consultationFee * 0.05 * 100) / 100; // 5% Admin cut
    const doctorEarnings = consultationFee - adminCommission;

    // 2. Create Appointment Record with Financial fields
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      date,
      time,
      type: type || "video",
      reason: reason || "",
      fee: consultationFee,
      adminCommission,
      doctorEarnings,
      paymentStatus: "pending",
    });

    // Populate patient & doctor details
    await appointment.populate("patient doctor", "name email phone age gender specialization");

    // 3. Trigger Notification & Socket Emit for Doctor
    try {
      if (doctor) {
        const newNotif = await Notification.create({
          user: doctor,
          title: "New Appointment Request",
          message: `New appointment request from ${req.user.name || "a patient"} for ${new Date(date).toLocaleDateString()}`,
          type: "appointment",
        });

        const io = req.app.get("io");
        if (io) {
          io.to(doctor.toString()).emit("appointment_updated", {
            type: "NEW_APPOINTMENT",
            appointment,
          });
          io.to(doctor.toString()).emit("new_notification", newNotif);
        }
      }
    } catch (notifErr) {
      console.error("Non-blocking Notification/Socket Error:", notifErr.message);
    }

    return res.status(201).json(appointment);
  } catch (err) {
    console.error("Booking Error:", err);
    return res.status(500).json({ message: err.message || "Failed to book appointment" });
  }
};

// GET /api/appointments (Role-aware: patient sees own, doctor sees assigned)
// GET /api/appointments
exports.listAppointments = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "doctor") {
      // Dono possibilities check karo (User ID vs Doctor Profile ID)
      filter = {
        $or: [
          { doctor: req.user._id },
          { doctor: req.user.doctorId || req.user._id }
        ]
      };
    } else {
      filter = { patient: req.user._id };
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const appointments = await Appointment.find(filter)
      .populate("patient", "name age gender phone bloodGroup")
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/appointments/:id/cancel
exports.cancelAppointment = async (req, res) => {
  try {
    const filter =
      req.user.role === "doctor"
        ? {
            _id: req.params.id,
            $or: [{ doctor: req.user._id }, { doctor: req.user.doctorId || req.user._id }]
          }
        : { _id: req.params.id, patient: req.user._id };

    const appt = await Appointment.findOneAndUpdate(
      filter,
      { status: "cancelled" },
      { new: true }
    );

    if (!appt) {
      return res.status(404).json({ message: "Appointment not found or unauthorized" });
    }

    return res.json(appt);
  } catch (err) {
    console.error("Cancel Appointment Error:", err);
    return res.status(500).json({ message: err.message });
  }
};