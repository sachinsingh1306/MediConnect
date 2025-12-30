const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

/* =========================
   REGISTER (Patient / Doctor / Admin)
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department: role === "doctor" ? department : undefined,
      isApproved: role === "doctor" ? false : true,
    });

    await user.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.isBlocked)
      return res.status(403).json({ message: "Account blocked by admin" });

    if (user.role === "doctor" && !user.isApproved)
      return res.status(403).json({ message: "Doctor not approved yet" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   BLOCK / UNBLOCK USER (ADMIN)
========================= */
router.put("/:id/block", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked ? "User blocked" : "User unblocked",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   APPROVE DOCTOR (ADMIN)
========================= */
router.put("/:id/approve", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.isApproved = true;
    await doctor.save();

    res.json({ message: "Doctor approved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
