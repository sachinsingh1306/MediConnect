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
      trim: true,
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

    /* ================= DOCTOR FIELDS ================= */
    specialization: {
      type: String,
      required: function () {
        return this.role === "doctor";
      },
      trim: true,
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
      trim: true,
    },

    /* ================= PATIENT FIELDS ================= */
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
      trim: true,
    },

    address: {
      type: String,
      required: function () {
        return this.role === "patient";
      },
      trim: true,
    },

    /* ================= STATUS ================= */
    isApproved: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ================= PRE-SAVE HOOK ================= */
userSchema.pre("save", function (next) {
  // Patients are auto-approved
  if (this.role === "patient") {
    this.isApproved = true;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
