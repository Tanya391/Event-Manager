// controllers/announcementController.js
const Announcement = require("../models/Announcement");
const Student = require("../models/Student");
const { sendEmail } = require("../utils/emailSender");

// -----------------------------
// CREATE ANNOUNCEMENT (ADMIN)
// -----------------------------
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, expiresAt } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        error: "title and message are required",
      });
    }

    // Validate expiresAt if provided
    let expiryDate = null;
    if (expiresAt) {
      const parsedDate = new Date(expiresAt);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ error: "Invalid expiresAt date format" });
      }
      expiryDate = parsedDate;
    }

    // Create announcement first (instant response)
    const announcement = await Announcement.create({
      title,
      message,
      relatedEvent: req.body.relatedEvent || null,
      createdBy: req.admin._id,
      expiresAt: expiryDate,
    });

    // Send immediate response to admin (don't wait for emails)
    res.status(201).json({
      message: "Announcement created successfully. Emails are being sent in background.",
      announcement,
    });

    // Send emails in background (non-blocking)
    // This runs after response is sent
    setImmediate(async () => {
      try {
        const students = await Student.find();

        // Send emails one by one with error handling
        for (const student of students) {
          try {
            await sendEmail({
              to: student.email,
              subject: `New Announcement: ${announcement.title}`,
              text: `Hello ${student.name},\n\n${announcement.message}`,
              html: `<p>Hello <strong>${student.name}</strong>,</p><p>${announcement.message}</p>`,
            });
            console.log(`✅ Email sent to ${student.email}`);
          } catch (emailError) {
            // Log error but continue with next student
            console.error(`❌ Failed to send email to ${student.email}:`, emailError.message);
          }
        }

        console.log(`📧 Finished sending announcement emails for: "${announcement.title}"`);
      } catch (err) {
        console.error('❌ Error in background email sending:', err.message);
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------
// GET ALL ANNOUNCEMENTS
// -----------------------------
exports.getAllAnnouncements = async (req, res) => {
  try {
    const now = new Date();
    const announcements = await Announcement.find({
      $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }],
    })
      .populate("createdBy", "name email")
      .populate("relatedEvent", "title date")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------
// GET SINGLE ANNOUNCEMENT
// -----------------------------
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.json(announcement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------
// UPDATE ANNOUNCEMENT (ADMIN)
// -----------------------------
exports.updateAnnouncement = async (req, res) => {
  try {
    const { expiresAt } = req.body;

    // Validate expiresAt if provided
    let expiryDate = undefined;
    if (expiresAt) {
      const parsedDate = new Date(expiresAt);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ error: "Invalid expiresAt date format" });
      }
      expiryDate = parsedDate;
    }

    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      { ...req.body, expiresAt: expiryDate },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.json({
      message: "Announcement updated successfully",
      updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------
// DELETE ANNOUNCEMENT (ADMIN)
// -----------------------------
exports.deleteAnnouncement = async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.json({ message: "Announcement deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};