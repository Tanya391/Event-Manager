// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { 
  adminRegister,
  adminLogin,
  studentRegister,
  studentLogin,
  studentVerifyOTP,
  logout 
} = require("../controllers/authController");

const {
  validateAdminRegister,
  validateAdminLogin,
  validateStudentRegister,
  validateStudentLogin,
  validateVerifyOTP
} = require("../middlewares/validationMiddleware");

// ============================================
// ADMIN AUTHENTICATION
// ============================================
router.post("/admin/register", validateAdminRegister, adminRegister);
router.post("/admin/login", validateAdminLogin, adminLogin);

// ============================================
// STUDENT AUTHENTICATION
// ============================================
router.post("/student/register", validateStudentRegister, studentRegister);
router.post("/student/login", validateStudentLogin, studentLogin);
router.post("/student/verify-otp", validateVerifyOTP, studentVerifyOTP);

// ============================================
// LOGOUT (Both Roles)
// ============================================
router.post("/logout", logout);

module.exports = router;