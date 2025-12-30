const express = require("express");
const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* DOCTOR CREATE PRESCRIPTION */
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Doctors only" });
    }

    const { appointmentId, medicines, notes } = req.body;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctorId: req.user.id,
      status: "completed",
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ message: "Completed appointment not found" });
    }

    const exists = await Prescription.findOne({ appointmentId });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Prescription already exists" });
    }

    const prescription = new Prescription({
      appointmentId,
      patientId: appointment.patientId,
      doctorId: req.user.id,
      medicines,
      notes,
    });

    await prescription.save();
    res.json(prescription);
  } catch {
    res.status(500).json({ message: "Prescription failed" });
  }
});

/* PATIENT VIEW PRESCRIPTIONS */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Patients only" });
    }

    const prescriptions = await Prescription.find({
      patientId: req.user.id,
    })
      .populate("doctorId", "name")
      .populate("appointmentId", "date time department");

    res.json(prescriptions);
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

module.exports = router;
