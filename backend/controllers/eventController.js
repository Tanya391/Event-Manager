// controllers/eventController.js
const Event = require('../models/Event');
const Student = require('../models/Student');

// Helper function to update event status
const updateEventStatus = (event) => {
  return event.updateStatus();
};

// Create event (admin)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, maxParticipants, status } = req.body;
    if (!title || !date || !location) return res.status(400).json({ error: 'title, date, location required' });

    const event = await Event.create({
      title, 
      description, 
      date, 
      time, 
      location, 
      maxParticipants,
      status: status || 'upcoming' // Allow admin to set initial status
    });

    res.status(201).json({ message: 'Event created', event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all events (public) - with auto status update
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    
    // Update status for each event
    const updatedEvents = events.map(event => {
      event.updateStatus();
      return event;
    });
    
    // Save updated statuses
    await Promise.all(updatedEvents.map(event => event.save()));
    
    res.json(updatedEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single event - with auto status update
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    // Update status
    event.updateStatus();
    await event.save();
    
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update event (admin)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      event[key] = req.body[key];
    });
    
    // If date changed, recalculate status (unless manually set to cancelled)
    if (req.body.date && event.status !== 'cancelled') {
      event.updateStatus();
    }
    
    await event.save();
    
    res.json({ message: 'Event updated', event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete event (admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register for event (student) - IMPROVED with status check
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Update event status first
    event.updateStatus();
    await event.save();

    // Get student info from authenticated token
    const student = req.student;

    // Check event status - only allow registration for upcoming events
    if (event.status === 'completed') {
      return res.status(400).json({ error: 'Cannot register. This event has already ended.' });
    }
    
    if (event.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot register. This event has been cancelled.' });
    }
    
    if (event.status === 'ongoing') {
      return res.status(400).json({ error: 'Cannot register. This event is currently ongoing.' });
    }

    // Check if event is full
    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ error: 'Event is full. Registration closed.' });
    }

    // Check if student is already registered
    const alreadyRegistered = event.participants.some(
      p => p.studentId === student.studentId
    );

    if (alreadyRegistered) {
      return res.status(400).json({ 
        error: 'You are already registered for this event.' 
      });
    }

    // Add student to participants
    const participant = {
      studentId: student.studentId,
      name: student.name,
      email: student.email
    };

    event.participants.push(participant);
    await event.save();

    res.json({ 
      message: 'Successfully registered for the event!',
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
        status: event.status
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel event (admin) - sets status to cancelled
exports.cancelEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    event.status = 'cancelled';
    await event.save();
    
    res.json({ message: 'Event cancelled successfully', event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete participant by studentId (admin)
exports.deleteParticipantByStudentId = async (req, res) => {
  try {
    const { eventId, studentId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const original = event.participants.length;
    event.participants = event.participants.filter(p => p.studentId !== studentId);

    if (event.participants.length === original) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    await event.save();
    res.json({ message: `Participant ${studentId} removed`, event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete all participants (admin)
exports.deleteAllParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    event.participants = [];
    await event.save();
    res.json({ message: 'All participants removed', event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};