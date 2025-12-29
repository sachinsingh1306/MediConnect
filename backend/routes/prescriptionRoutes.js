const express = require("express");
const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * =========================
 * DOCTOR WRITE PRESCRIPTION
 * =========================
 */
router.post("/:appointmentId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const prescription = new Prescription({
      appointmentId: appointment._id,
      doctorId: req.user.id,
      patientId: appointment.patientId,
      medicines: req.body.medicines,
      notes: req.body.notes,
    });

    await prescription.save();

    res.status(201).json({
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.error("Prescription error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * =========================
 * PATIENT VIEW PRESCRIPTIONS
 * =========================
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Access denied" });
    }

    const prescriptions = await Prescription.find({
      patientId: req.user.id,
    })
      .populate("doctorId", "name")
      .populate("appointmentId", "date time");

    res.json(prescriptions);
  } catch (error) {
    console.error("View prescription error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
