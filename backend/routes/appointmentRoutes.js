const express = require("express");
const Appointment = require("../models/Appointment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==============================
// PATIENT BOOK APPOINTMENT
// ==============================
router.post("/", authMiddleware, async (req, res) => {
  const appointment = new Appointment({
    patientId: req.user.id,
    doctor: req.body.doctor,
    date: req.body.date,
    time: req.body.time,
    reason: req.body.reason,
  });

  await appointment.save();
  res.json({ message: "Appointment booked successfully" });
});


// ==============================
// PATIENT VIEW MY APPOINTMENTS
// ==============================
router.get("/my", authMiddleware, async (req, res) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({ message: "Access denied" });
  }

  const appointments = await Appointment.find({
    patientId: req.user.id
  }).select("doctor date time status reason");

  res.json(appointments);
});



// ==============================
// DOCTOR VIEW APPOINTMENTS
// ==============================
router.get("/doctor", authMiddleware, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied" });
  }

  const appointments = await Appointment.find()
    .populate("patientId", "name")
    .select("patientId status");

  res.json(appointments);
});

// ==============================
// DOCTOR UPDATE APPOINTMENT STATUS
// ==============================
router.put("/:id/status", authMiddleware, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { status } = req.body;

  const allowed = ["accepted", "rejected", "completed"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  appointment.status = status;
  await appointment.save();

  res.json({ message: "Status updated", appointment });
});

module.exports = router;
