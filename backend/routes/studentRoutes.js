// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  getMyRegistrations,
  updateMyProfile
} = require("../controllers/studentController");

const { verifyStudent } = require("../middlewares/authMiddleware");

const {
  validateUpdateProfile
} = require("../middlewares/validationMiddleware");

// All student routes require student authentication
router.get("/profile", verifyStudent, getMyProfile);
router.get("/registrations", verifyStudent, getMyRegistrations);

const upload = require("../middlewares/uploadMiddleware");
router.put("/profile", verifyStudent, upload.single('profileImage'), validateUpdateProfile, updateMyProfile);

module.exports = router;