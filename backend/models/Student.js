// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    studentId: {
      type: String,
      required: true,
      unique: true,
    },

    // useful for dashboard
    department: String,
    year: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
