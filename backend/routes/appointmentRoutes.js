const express = require("express");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* GET APPROVED DOCTORS BY DEPARTMENT */
router.get("/doctors/:department", authMiddleware, async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      department: req.params.department,
      isApproved: true,
      isBlocked: false,
    }).select("name department");

    res.json(doctors);
  } catch {
    res.status(500).json({ message: "Failed to load doctors" });
  }
});

/* PATIENT BOOK APPOINTMENT */
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "patient")
      return res.status(403).json({ message: "Patients only" });

    const appointment = new Appointment({
      patientId: req.user.id,
      doctorId: req.body.doctorId,
      department: req.body.department,
      date: req.body.date,
      time: req.body.time,
      reason: req.body.reason,
      age: req.body.age,
      bloodGroup: req.body.bloodGroup,
      address: req.body.address,
    });

    await appointment.save();
    res.json({ message: "Appointment booked" });
  } catch {
    res.status(500).json({ message: "Booking failed" });
  }
});

/* PATIENT VIEW APPOINTMENTS */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "patient")
      return res.status(403).json({ message: "Access denied" });

    const appointments = await Appointment.find({
      patientId: req.user.id,
    }).populate("doctorId", "name");

    res.json(appointments);
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* DOCTOR VIEW APPOINTMENTS */
router.get("/doctor", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor")
      return res.status(403).json({ message: "Access denied" });

    const appointments = await Appointment.find({
      doctorId: req.user.id,
    }).populate("patientId", "name");

    res.json(appointments);
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* DOCTOR UPDATE STATUS */
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor")
      return res.status(403).json({ message: "Access denied" });

    const allowed = ["accepted", "rejected", "completed"];
    if (!allowed.includes(req.body.status))
      return res.status(400).json({ message: "Invalid status" });

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctorId: req.user.id,
    });

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.status = req.body.status;
    await appointment.save();

    res.json({ message: "Status updated" });
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
