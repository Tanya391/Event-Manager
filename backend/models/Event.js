// models/Event.js
const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    date: { type: Date, required: true },
    time: { type: String },

    location: { type: String, required: true },

    maxParticipants: { type: Number, default: 100 },

    participants: [participantSchema],

    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
    },

    registrationDeadline: {
      type: Date,
      default: null  // Optional: if null, can register until event starts
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    }
  },
  { timestamps: true }
);

// Method to auto-calculate status based on date
eventSchema.methods.updateStatus = function() {
  const now = new Date();
  const eventDate = new Date(this.date);
  
  // Don't update if manually set to cancelled
  if (this.status === 'cancelled') {
    return this.status;
  }
  
  // Event date (start of day)
  const eventDateStart = new Date(eventDate);
  eventDateStart.setHours(0, 0, 0, 0);
  
  // Event date (end of day)
  const eventDateEnd = new Date(eventDate);
  eventDateEnd.setHours(23, 59, 59, 999);
  
  // Today (start of day)
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  
  if (now > eventDateEnd) {
    this.status = 'completed';
  } else if (now >= eventDateStart && now <= eventDateEnd) {
    this.status = 'ongoing';
  } else if (eventDateStart > todayStart) {
    this.status = 'upcoming';
  }
  
  return this.status;
};

// Method to check if registration is still open
eventSchema.methods.isRegistrationOpen = function() {
  const now = new Date();
  
  // Update status first
  this.updateStatus();
  
  // Can't register for completed, cancelled, or ongoing events
  if (this.status !== 'upcoming') {
    return false;
  }
  
  // If event is full
  if (this.participants.length >= this.maxParticipants) {
    return false;
  }
  
  // Check registration deadline if set
  if (this.registrationDeadline) {
    const deadline = new Date(this.registrationDeadline);
    deadline.setHours(23, 59, 59, 999); // End of deadline day
    
    if (now > deadline) {
      return false;
    }
  }
  
  return true;
};

module.exports = mongoose.model("Event", eventSchema);