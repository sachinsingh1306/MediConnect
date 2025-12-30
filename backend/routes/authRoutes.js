const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      role,
      age,
      bloodGroup,
      address,
      specialization,
      experience,
      department,
      adminCode,
    } = req.body;

    email = email.toLowerCase().trim();

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (role === "admin" && adminCode !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid admin code" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      age,
      bloodGroup,
      address,
      specialization,
      experience,
      department,
    });

    await user.save();
    res.status(201).json({ message: "Registered successfully" });
  } catch {
    res.status(500).json({ message: "Registration failed" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const { password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account blocked" });
    }

    if (user.role === "doctor" && !user.isApproved) {
      return res.status(403).json({ message: "Doctor not approved yet" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
