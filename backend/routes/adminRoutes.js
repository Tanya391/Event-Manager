// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAdminProfile,
  updateAdminProfile,
  createAnnouncementAsAdmin,
  listAnnouncementsForAdmin,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require("../controllers/adminController");

const { verifyAdmin } = require("../middlewares/authMiddleware");

const {
  validateCreateAnnouncement,
  validateUpdateProfile,
  validateMongoId
} = require("../middlewares/validationMiddleware");

// All admin routes require admin authentication
// Admin Profile
router.get("/profile", verifyAdmin, getAdminProfile);

const upload = require("../middlewares/uploadMiddleware");
router.put("/profile", verifyAdmin, upload.single('profileImage'), validateUpdateProfile, updateAdminProfile);

// Admin Announcements
router.post("/announcements", verifyAdmin, validateCreateAnnouncement, createAnnouncementAsAdmin);
router.get("/announcements", verifyAdmin, listAnnouncementsForAdmin);

// Admin Manages Students
router.get("/students", verifyAdmin, getAllStudents);
router.get("/students/:id", verifyAdmin, validateMongoId('id'), getStudentById);
router.put("/students/:id", verifyAdmin, validateMongoId('id'), validateUpdateProfile, updateStudent);
router.delete("/students/:id", verifyAdmin, validateMongoId('id'), deleteStudent);

module.exports = router;