const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==============================
// GET ALL USERS (ADMIN)
// ==============================
router.get("/users", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const users = await User.find().select("-password");
  res.json(users);
});

// ==============================
// APPROVE DOCTOR
// ==============================
router.put("/:id/approve", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "doctor") {
    return res.status(400).json({ message: "Only doctors can be approved" });
  }

  user.isApproved = true;
  await user.save();

  res.json({ message: "Doctor approved successfully" });
});

// get patient
router.get("/patients", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const patients = await User.find({ role: "patient" }).select("-password");
  res.json(patients);
});


module.exports = router;
