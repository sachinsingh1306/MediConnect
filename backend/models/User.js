const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
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

    // ================= DOCTOR FIELDS =================
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

    // ================= PATIENT FIELDS =================
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

    // ================= STATUS =================
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

// ✅ FIXED PRE-SAVE HOOK
userSchema.pre("save", function () {
  if (this.role === "patient") {
    this.isApproved = true;
  }
});

module.exports = mongoose.model("User", userSchema);
