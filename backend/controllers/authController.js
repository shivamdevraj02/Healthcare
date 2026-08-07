const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createNotification } = require("../utils/notificationHelper");

const genToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, specialization, qualification } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const assignedRole = ["patient", "doctor", "admin"].includes(role) ? role : "patient";
    const approvalStatus = assignedRole === "doctor" ? "pending" : "approved";

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone,
      specialization,
      qualification,
      approvalStatus,
    });

    if (assignedRole === "doctor") {
      const admin = await User.findOne({ role: "admin" }).select("_id");
      if (admin) {
        await createNotification(
          admin._id,
          "New doctor registration",
          `${user.name} has registered as a doctor and is waiting for your approval.`,
          "info"
        );
      }

      await createNotification(
        user._id,
        "Pending approval",
        "Your doctor account is pending admin approval. You will be able to sign in once approved.",
        "info"
      );


      return res.status(201).json({
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        message: "Doctor account created. Please wait for admin approval before logging in.",
      });
    }

    const token = genToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account is inactive. Please contact support." });
    }

    if (user.role === "doctor") {
      if (user.approvalStatus === "pending") {
        return res.status(403).json({ message: "Admin has not approved your account yet. Please wait for approval." });
      }
      if (user.approvalStatus === "rejected") {
        return res.status(403).json({ message: "Your doctor account was rejected by admin." });
      }
    }

    const token = genToken(user._id);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, approvalStatus: user.approvalStatus },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};