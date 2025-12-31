const express = require("express");
const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ===========================
   CREATE PRESCRIPTION
=========================== */
router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { appointmentId, medicines, notes } = req.body;

  if (!appointmentId || !medicines?.length) {
    return res.status(400).json({ message: "Missing data" });
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  const prescription = new Prescription({
    appointmentId,
    patientId: appointment.patientId,
    doctorId: req.user._id,
    medicines,
    notes,
  });

  await prescription.save();
  res.json(prescription);
});

/* ===========================
   DOCTOR VIEW HIS PRESCRIPTIONS
=========================== */
router.get("/doctor", authMiddleware, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied" });
  }

  const prescriptions = await Prescription.find({
    doctorId: req.user._id,
  })
    .populate("patientId", "name")
    .populate("appointmentId", "date time");

  res.json(prescriptions);
});

/* ===========================
   GET SINGLE PRESCRIPTION
=========================== */
router.get("/:id", authMiddleware, async (req, res) => {
  const prescription = await Prescription.findById(req.params.id).populate(
    "patientId",
    "name"
  );

  if (!prescription) {
    return res.status(404).json({ message: "Prescription not found" });
  }

  res.json(prescription);
});

/* ===========================
   UPDATE PRESCRIPTION
=========================== */
router.put("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied" });
  }

  const prescription = await Prescription.findById(req.params.id);
  if (!prescription) {
    return res.status(404).json({ message: "Prescription not found" });
  }

  if (prescription.doctorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not your prescription" });
  }

  prescription.medicines = req.body.medicines;
  prescription.notes = req.body.notes;

  await prescription.save();
  res.json({ message: "Prescription updated", prescription });
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
