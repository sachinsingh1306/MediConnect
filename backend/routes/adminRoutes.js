const express = require("express");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * =========================
 * ADMIN ONLY MIDDLEWARE
 * =========================
 */
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

/**
 * =========================
 * GET ALL USERS
 * =========================
 */
router.get("/users", authMiddleware, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

/**
 * =========================
 * GET ALL APPOINTMENTS
 * =========================
 */
router.get("/appointments", authMiddleware, adminOnly, async (req, res) => {
  const appointments = await Appointment.find()
    .populate("patientId", "name")
    .populate("doctor", "name");

  res.json(appointments);
});

/**
 * =========================
 * APPROVE / BLOCK DOCTOR
 * =========================
 */
router.put("/doctor/:id/approve", authMiddleware, adminOnly, async (req, res) => {
  const doctor = await User.findById(req.params.id);

  if (!doctor || doctor.role !== "doctor") {
    return res.status(404).json({ message: "Doctor not found" });
  }

  doctor.isApproved = !doctor.isApproved;
  await doctor.save();

  res.json({
    message: `Doctor ${
      doctor.isApproved ? "approved" : "blocked"
    } successfully`,
  });
});

/**
 * =========================
 * DASHBOARD STATS
 * =========================
 */
router.get("/stats", authMiddleware, adminOnly, async (req, res) => {
  const users = await User.countDocuments();
  const doctors = await User.countDocuments({ role: "doctor" });
  const patients = await User.countDocuments({ role: "patient" });
  const appointments = await Appointment.countDocuments();

  res.json({ users, doctors, patients, appointments });
});

module.exports = router;
