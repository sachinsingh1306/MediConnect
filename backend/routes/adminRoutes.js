const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

/* GET ALL USERS */
router.get("/users", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* GET ALL PATIENTS */
router.get(
  "/patients",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const patients = await User.find({ role: "patient" }).select("-password");
      res.json(patients);
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* APPROVE DOCTOR */
router.put(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const doctor = await User.findById(req.params.id);
      if (!doctor || doctor.role !== "doctor") {
        return res.status(404).json({ message: "Doctor not found" });
      }

      doctor.isApproved = true;
      await doctor.save();

      res.json({ message: "Doctor approved" });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* BLOCK / UNBLOCK USER */
router.put(
  "/:id/block",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.isBlocked = !user.isBlocked;
      await user.save();

      res.json({
        message: user.isBlocked ? "User blocked" : "User unblocked",
      });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
