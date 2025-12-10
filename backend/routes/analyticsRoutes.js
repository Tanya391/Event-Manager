// routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getRecentRegistrations,
  getPopularEvents,
  getUpcomingEventsStats,
  getStudentEngagement,
  getMonthlyStats
} = require("../controllers/analyticsController");

const { verifyAdmin } = require("../middlewares/authMiddleware");

// All analytics routes require admin authentication

// Dashboard overview
router.get("/dashboard", verifyAdmin, getDashboardStats);

// Recent registrations
router.get("/registrations/recent", verifyAdmin, getRecentRegistrations);

// Popular events
router.get("/events/popular", verifyAdmin, getPopularEvents);

// Upcoming events with stats
router.get("/events/upcoming", verifyAdmin, getUpcomingEventsStats);

// Student engagement
router.get("/students/engagement", verifyAdmin, getStudentEngagement);

// Monthly statistics
router.get("/monthly", verifyAdmin, getMonthlyStats);

module.exports = router;