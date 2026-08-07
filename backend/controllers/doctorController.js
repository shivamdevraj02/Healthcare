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
    ).populate("patient", "name age gender phone");

    if (!appt) return res.status(404).json({ message: "Appointment not found" });
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
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { availability: req.body.availability },
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
    const doctors = await User.find({ role: "doctor" })
      .select("name specialization qualification experienceYears availability email phone")
      .sort({ name: 1 });
    res.status(200).json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Failed to fetch doctors list" });
  }
};