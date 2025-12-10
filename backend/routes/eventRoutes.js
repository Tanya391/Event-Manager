// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelEvent,
  deleteParticipantByStudentId,
  deleteAllParticipants
} = require("../controllers/eventController");

const { verifyAdmin, verifyStudent } = require("../middlewares/authMiddleware");

const {
  validateCreateEvent,
  validateUpdateEvent,
  validateMongoId
} = require("../middlewares/validationMiddleware");

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all events (public access)
router.get("/", getAllEvents);

// Get single event by ID (public access)
router.get("/:id", validateMongoId('id'), getEventById);

// ============================================
// STUDENT ROUTES
// ============================================

// Register for an event (student only)
router.post("/:id/register", verifyStudent, validateMongoId('id'), registerForEvent);

// ============================================
// ADMIN ROUTES
// ============================================

// Create new event (admin only)
router.post("/", verifyAdmin, validateCreateEvent, createEvent);

// Update event (admin only)
router.put("/:id", verifyAdmin, validateMongoId('id'), validateUpdateEvent, updateEvent);

// Delete event (admin only)
router.delete("/:id", verifyAdmin, validateMongoId('id'), deleteEvent);

// Cancel event (admin only)
router.patch("/:id/cancel", verifyAdmin, validateMongoId('id'), cancelEvent);

// Delete specific participant from event (admin only)
router.delete("/:eventId/participants/:studentId", verifyAdmin, deleteParticipantByStudentId);

// Delete all participants from event (admin only)
router.delete("/:eventId/participants", verifyAdmin, deleteAllParticipants);

module.exports = router;