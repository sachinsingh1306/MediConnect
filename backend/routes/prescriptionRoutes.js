const express = require("express");
const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ===============================
   DOCTOR CREATE PRESCRIPTION
================================ */
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { appointmentId, medicines, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const prescription = new Prescription({
      appointmentId,
      patientId: appointment.patientId,
      doctorId: req.user.id,
      medicines,
      notes,
    });

    await prescription.save();

    console.log("Prescription Saved:", prescription); // ✅ DEBUG

    res.json(prescription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Prescription error" });
  }
});

/* ===============================
   PATIENT VIEW MY PRESCRIPTIONS
================================ */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Access denied" });
    }

    const prescriptions = await Prescription.find({
      patientId: req.user.id, // ✅ FIX
    })
      .populate("doctorId", "name")
      .populate("appointmentId", "date time department");

    console.log("Found prescriptions:", prescriptions.length); // ✅ DEBUG

    res.json(prescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

module.exports = router;
