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
    let { name, email, password, role, phone, specialization } = req.body;

    // Clean inputs
    email = email?.toLowerCase().trim();
    phone = phone?.trim();

    // 1. Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // 2. Validate Password Rules
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password is too weak. Must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special symbol.",
      });
    }

    // 3. Hash password & Save
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "patient",
      phone,
      specialization: role === "doctor" ? specialization : undefined,
    });

    res.status(201).json({ message: "Registration successful!", user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
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