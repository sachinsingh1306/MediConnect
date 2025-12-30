const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

/* =========================
   ADMIN ONLY MIDDLEWARE
========================= */
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

/* =========================
   GET ALL USERS
========================= */
router.get("/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   APPROVE DOCTOR
========================= */
router.put("/:id/approve", authMiddleware, adminOnly, async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.isApproved = true;
    await doctor.save();

    res.json({ message: "Doctor approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   BLOCK / UNBLOCK USER
========================= */
router.put("/:id/block", authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked ? "User blocked" : "User unblocked",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
