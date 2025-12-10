// controllers/analyticsController.js
const Student = require('../models/Student');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');

// ============================================
// DASHBOARD ANALYTICS
// ============================================

exports.getDashboardStats = async (req, res) => {
  try {
    // Update all event statuses first
    const allEvents = await Event.find();
    await Promise.all(allEvents.map(event => {
      event.updateStatus();
      return event.save();
    }));

    // Count totals
    const totalStudents = await Student.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalAnnouncements = await Announcement.countDocuments();

    // Count events by status
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
    const ongoingEvents = await Event.countDocuments({ status: 'ongoing' });
    const completedEvents = await Event.countDocuments({ status: 'completed' });
    const cancelledEvents = await Event.countDocuments({ status: 'cancelled' });

    // Calculate total registrations across all events
    const eventsWithParticipants = await Event.find({}, 'participants');
    const totalRegistrations = eventsWithParticipants.reduce(
      (sum, event) => sum + event.participants.length, 
      0
    );

    // Get active announcements (not expired)
    const now = new Date();
    const activeAnnouncements = await Announcement.countDocuments({
      $or: [
        { expiresAt: null },
        { expiresAt: { $gte: now } }
      ]
    });

    res.json({
      totalStudents,
      totalEvents,
      totalAnnouncements,
      activeAnnouncements,
      totalRegistrations,
      eventsByStatus: {
        upcoming: upcomingEvents,
        ongoing: ongoingEvents,
        completed: completedEvents,
        cancelled: cancelledEvents
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// RECENT REGISTRATIONS
// ============================================

exports.getRecentRegistrations = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent events with participants
    const events = await Event.find({ 'participants.0': { $exists: true } })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select('title date participants updatedAt');

    // Flatten registrations with event details
    const recentRegistrations = [];
    
    events.forEach(event => {
      event.participants.forEach(participant => {
        recentRegistrations.push({
          eventTitle: event.title,
          eventDate: event.date,
          studentName: participant.name,
          studentEmail: participant.email,
          studentId: participant.studentId
        });
      });
    });

    // Sort by most recent and limit
    const sortedRegistrations = recentRegistrations.slice(0, limit);

    res.json({
      count: sortedRegistrations.length,
      registrations: sortedRegistrations
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// POPULAR EVENTS (Most Registered)
// ============================================

exports.getPopularEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const events = await Event.find()
      .sort({ updatedAt: -1 });

    // Calculate participant count and sort
    const eventsWithCount = events.map(event => ({
      id: event._id,
      title: event.title,
      date: event.date,
      location: event.location,
      status: event.status,
      maxParticipants: event.maxParticipants,
      participantCount: event.participants.length,
      registrationRate: ((event.participants.length / event.maxParticipants) * 100).toFixed(1)
    }));

    // Sort by participant count
    eventsWithCount.sort((a, b) => b.participantCount - a.participantCount);

    res.json({
      count: eventsWithCount.length,
      events: eventsWithCount.slice(0, limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// UPCOMING EVENTS WITH REGISTRATION STATUS
// ============================================

exports.getUpcomingEventsStats = async (req, res) => {
  try {
    // Update statuses
    const allEvents = await Event.find();
    await Promise.all(allEvents.map(event => {
      event.updateStatus();
      return event.save();
    }));

    const upcomingEvents = await Event.find({ status: 'upcoming' })
      .sort({ date: 1 });

    const eventsStats = upcomingEvents.map(event => {
      const registrationOpen = event.isRegistrationOpen();
      const participantCount = event.participants.length;
      const spotsLeft = event.maxParticipants - participantCount;
      const fillRate = ((participantCount / event.maxParticipants) * 100).toFixed(1);

      return {
        id: event._id,
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        registrationDeadline: event.registrationDeadline,
        registrationOpen,
        participantCount,
        maxParticipants: event.maxParticipants,
        spotsLeft,
        fillRate: `${fillRate}%`,
        status: event.status
      };
    });

    res.json({
      count: eventsStats.length,
      events: eventsStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// STUDENT ENGAGEMENT
// ============================================

exports.getStudentEngagement = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    
    // Get all events
    const events = await Event.find({}, 'participants');
    
    // Count unique students who registered for at least one event
    const registeredStudentIds = new Set();
    events.forEach(event => {
      event.participants.forEach(p => {
        registeredStudentIds.add(p.studentId);
      });
    });
    
    const activeStudents = registeredStudentIds.size;
    const inactiveStudents = totalStudents - activeStudents;
    const engagementRate = totalStudents > 0 
      ? ((activeStudents / totalStudents) * 100).toFixed(1) 
      : 0;

    res.json({
      totalStudents,
      activeStudents,
      inactiveStudents,
      engagementRate: `${engagementRate}%`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// MONTHLY STATISTICS
// ============================================

exports.getMonthlyStats = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    
    // Get events created per month
    const eventsByMonth = await Event.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get students registered per month
    const studentsByMonth = await Student.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Format response
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthlyData = months.map((month, index) => {
      const monthNum = index + 1;
      const eventData = eventsByMonth.find(e => e._id === monthNum);
      const studentData = studentsByMonth.find(s => s._id === monthNum);

      return {
        month,
        events: eventData ? eventData.count : 0,
        students: studentData ? studentData.count : 0
      };
    });

    res.json({
      year,
      monthlyData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};