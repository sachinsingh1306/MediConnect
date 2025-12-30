const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    isApproved:{
      type: Boolean,
      default: function () {
        // ✅ Auto-approve patient & admin
        return this.role === "patient" || this.role === "admin";
      },
    },

    isBlocked: { type: Boolean, default: false },

    // Patient fields
    age: {
      type: Number,
      required: function () {
        return this.role === "patient";
      },
    },

    bloodGroup: {
      type: String,
      required: function () {
        return this.role === "patient";
      },
    },

    address: {
      type: String,
      required: function () {
        return this.role === "patient";
      },
    },

    // Doctor fields
    specialization: {
      type: String,
      required: function () {
        return this.role === "doctor";
      },
    },

    experience: {
      type: Number,
      required: function () {
        return this.role === "doctor";
      },
    },

    department: {
      type: String,
      required: function () {
        return this.role === "doctor";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
