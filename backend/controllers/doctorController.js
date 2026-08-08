const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");

// GET /api/doctor/dashboard
// Example: controllers/doctorController.js
exports.getDashboard = async (req, res) => {
  try {
    const doctorId = req.user._id;

    // Fetch all pending requests for this doctor
    const pendingRequests = await Appointment.find({
      doctor: doctorId,
      status: "pending",
    })
      .populate("patient", "name age gender phone")
      .sort({ createdAt: -1 });

    // Fetch today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysAppointments = await Appointment.find({
      $or: [{ doctor: doctorId }, { doctor: req.user.doctorId }],
      status: "confirmed"
    }).populate("patient", "name time");

    res.json({
      pendingRequests,
      todaysAppointments,
      totalPatients: await Appointment.countDocuments({ doctor: doctorId, status: "completed" })
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/doctor/appointments
exports.getAppointments = async (req, res) => {
  try {
    const filter = { doctor: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const appointments = await Appointment.find(filter)
      .populate("patient", "name age gender phone email")
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/doctor/appointments/:id  (Confirm / Complete / Cancel)
exports.updateAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findOneAndUpdate(
      { _id: req.params.id, doctor: req.user._id },
      { status: req.body.status, notes: req.body.notes },
      { new: true }
    ).populate("patient", "name email age gender phone"); // Ensure patient email is populated

    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    // Send Confirmation Email if the status is updated to "confirmed"
    if (req.body.status === "confirmed") {
      const doctor = req.user; 
      
      // Generates "sw" + the last 3 characters of the unique appointment ID
      const videoRoomId = `sw${appt._id.toString().slice(-3)}`; 
      
      // Format the date to be more readable (e.g., "Monday, August 7, 2026")
      const formattedDate = new Date(appt.date).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      const subject = `Appointment Confirmed: Dr. ${doctor.name} - SwasthSetu`;
      
      // The Improved Email Template
      const message = `Dear ${appt.patient.name},

We are pleased to inform you that your appointment has been successfully confirmed!

📅 Appointment Details:
--------------------------------------
Doctor: Dr. ${doctor.name}
Specialization: ${doctor.specialization || "General Physician"}
Date: ${formattedDate}
Time: ${appt.time}
Type: ${appt.type === 'video' ? 'Video Consultation 📹' : 'In-Person Visit 🏥'}

${appt.type === 'video' ? `🔗 Video Consultation Instructions:
--------------------------------------
Your Secure Video Room ID is: ${videoRoomId}

Please log in to your SwasthSetu Patient Portal 5 minutes before your scheduled time. Navigate to "Treat Disease" -> "Video Consultation", and enter your Room ID to join the call.` : `📍 Clinic Instructions:
--------------------------------------
Please arrive at the clinic 10 minutes before your scheduled appointment time.`}

If you need to cancel or reschedule, please do so via your Patient Dashboard.

Wishing you good health,
The SwasthSetu Team
support@swasthsetu.app`;

      // Send the email
      await sendEmail(appt.patient.email, subject, message);
    }

    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/doctor/patients
exports.getPatients = async (req, res) => {
  try {
    const patientIds = await Appointment.distinct("patient", { doctor: req.user._id });
    const patients = await User.find({ _id: { $in: patientIds } }).select("-password");
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/doctor/prescriptions
exports.createPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.create({
      ...req.body,
      doctor: req.user._id,
    });
    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/doctor/prescriptions
exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.user._id })
      .populate("patient", "name age gender")
      .sort({ date: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/doctor/availability
exports.updateAvailability = async (req, res) => {
  try {
    const incoming = Array.isArray(req.body.availability) ? req.body.availability : [];
    const normalized = incoming
      .filter((item) => item && item.day)
      .map((item) => ({
        day: String(item.day).trim(),
        slots: Array.isArray(item.slots)
          ? [...new Set(item.slots.map((slot) => String(slot).trim()).filter(Boolean))]
          : [],
      }))
      .filter((item) => item.slots.length > 0);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { availability: normalized },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/doctor/profile
exports.updateProfile = async (req, res) => {
  try {
    const allowed = [
      "name",
      "phone",
      "specialization",
      "qualification",
      "experienceYears",
      "avatar",
    ];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/patient/doctors (Patients list view for doctors)
exports.listDoctors = async (req, res) => {
  try {
    // Cache-Control headers ensure browser/client latest data mangta hai
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
    
    const doctors = await User.find({ role: "doctor", approvalStatus: "approved" })
      .select("name specialization qualification experienceYears availability email phone consultationFee") // 'consultationFee' include karna zaroori hai
      .sort({ name: 1 });
    res.status(200).json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Failed to fetch doctors list" });
  }
};