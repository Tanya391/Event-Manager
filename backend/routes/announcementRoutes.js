// routes/announcementRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const { verifyAdmin } = require("../middlewares/authMiddleware");

const {
  validateCreateAnnouncement,
  validateUpdateAnnouncement,
  validateMongoId
} = require("../middlewares/validationMiddleware");

// PUBLIC ROUTES
router.get("/", getAllAnnouncements);
router.get("/:id", validateMongoId('id'), getAnnouncementById);

// ADMIN PROTECTED ROUTES
router.post("/", verifyAdmin, validateCreateAnnouncement, createAnnouncement);
router.put("/:id", verifyAdmin, validateMongoId('id'), validateUpdateAnnouncement, updateAnnouncement);
router.delete("/:id", verifyAdmin, validateMongoId('id'), deleteAnnouncement);

module.exports = router;