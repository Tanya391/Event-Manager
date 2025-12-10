// models/OTP.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // Auto-delete after 5 minutes (300 seconds)
    },
  }
);

// Index for faster lookups
otpSchema.index({ email: 1, createdAt: 1 });

module.exports = mongoose.model("OTP", otpSchema);