// controllers/authController.js
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const OTP = require("../models/OTP");
const TokenBlacklist = require("../models/TokenBlacklist");
const { generateToken } = require("../config/jwt");
const { sendEmail } = require("../utils/emailSender");

// ============================================
// ADMIN AUTHENTICATION
// ============================================

// Admin Registration
exports.adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists with this email" });
    }

    // Create new admin (password will be hashed by pre-save hook)
    const admin = await Admin.create({ name, email, password });

    // Generate JWT token
    const token = generateToken(admin._id);

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(admin._id);

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// STUDENT AUTHENTICATION
// ============================================

// Student Registration
exports.studentRegister = async (req, res) => {
  try {
    const { name, email, studentId, department, year } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { studentId }]
    });

    if (existingStudent) {
      return res.status(400).json({
        error: "Student already exists with this email or student ID"
      });
    }

    // Create new student
    const student = await Student.create({
      name,
      email,
      studentId,
      department,
      year
    });

    res.status(201).json({
      message: "Student registered successfully. Please login to receive OTP.",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Student Login (Send OTP)
exports.studentLogin = async (req, res) => {
  try {
    const { email, studentId } = req.body;

    // Find student
    const student = await Student.findOne({ email, studentId });
    if (!student) {
      return res.status(401).json({
        error: "Invalid credentials. Please check your email and student ID."
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Save OTP to database (will auto-expire in 5 minutes)
    await OTP.create({ email, otp });

    // Send OTP via email
    try {
      await sendEmail({
        to: email,
        subject: "Your Login OTP - College Event Portal",
        text: `Hello ${student.name},\n\nYour OTP for login is: ${otp}\n\nThis OTP will expire in 5 minutes.\n\nIf you didn't request this, please ignore this email.`,
        html: `
          <h2>College Event Portal - Login OTP</h2>
          <p>Hello <strong>${student.name}</strong>,</p>
          <p>Your OTP for login is:</p>
          <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in <strong>5 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      });

      res.json({
        message: "OTP sent to your email. Please verify to complete login.",
        email: email
      });
    } catch (emailError) {
      // If email fails, delete the OTP and return error
      await OTP.deleteMany({ email });
      console.error("Email sending failed:", emailError);
      return res.status(500).json({
        error: "Failed to send OTP email. Please try again later."
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Student Verify OTP
exports.studentVerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(401).json({
        error: "Invalid or expired OTP. Please request a new one."
      });
    }

    // Find student
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ error: "Student not found" });
    }

    // Delete OTP after successful verification
    await OTP.deleteMany({ email });

    // Generate JWT token
    const token = generateToken(student._id);

    res.json({
      message: "Login successful",
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        department: student.department,
        year: student.year
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// LOGOUT (Both Admin and Student)
// ============================================

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Calculate token expiry (7 days from now, matching JWT_EXPIRE)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Add token to blacklist
    await TokenBlacklist.create({ token, expiresAt });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};