const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");
const User = require("../models/User");

// POST /api/appointments (Patient books an appointment)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctor, date, time, type, reason } = req.body;
    const address = (req.body.address || "").trim();

    if (!doctor || !date || !time || !address) {
      return res
        .status(400)
        .json({ message: "doctor, date, time and address are required" });
    }

    // 1. Create Appointment Record
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      date,
      time,
      type: type || "video",
      reason: reason || "",
      address,
    });

    // Populate patient details taaki doctor side UI me name, age, phone instant render ho sake
    await appointment.populate("patient doctor", "name email phone age gender");

    // 2. Safely Trigger Notification & Socket Emit for Doctor
    try {
      if (doctor) {
        const newNotif = await Notification.create({
          user: doctor,
          title: "New Appointment Request",
          message: `New appointment request from ${req.user.name || "a patient"} for ${new Date(date).toLocaleDateString()}`,
          type: "appointment",
        });

        const doctorData = await User.findById(doctor).select("email name");
        if (doctorData?.email) {
          const { sendEmail } = require("../utils/emailService");
          await sendEmail(
            doctorData.email,
            "New Appointment Request - SwasthSetu",
            `You have a new appointment request from ${req.user.name || "a patient"} on ${new Date(date).toLocaleDateString()} at ${time}.`
          );
        }

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

   // 3. Camp Detection Logic
    // Use the sanitized 'address' variable and make the search case-insensitive
    const patientDensity = await Appointment.countDocuments({
      doctor: doctor,
      address: { $regex: new RegExp(`^${address}$`, "i") },
      status: { $in: ["pending", "confirmed"] },
    });

    // 4. Trigger Camp Alert if threshold is met

    if (patientDensity >= 2 && address) {
      const { createNotification } = require("../utils/notificationHelper");
      const { sendEmail } = require("../utils/emailService");
      const docData = await User.findById(doctor);
      const campMessage = `Medical Camp Alert: You have ${patientDensity} patients requesting consultations from the same location (${address}). Consider setting up a medical camp in this area.`;

      await createNotification(doctor, "Medical Camp Recommendation", campMessage, "info");

      if (docData && docData.email) {
        await sendEmail(docData.email, "Medical Camp Recommendation - SwasthSetu", campMessage);
      }
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