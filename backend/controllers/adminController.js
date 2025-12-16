// controllers/adminController.js
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Announcement = require('../models/Announcement');

// ============================================
// ADMIN PROFILE & MANAGEMENT
// ============================================

// Get admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const admin = await Admin.findById(adminId).select('-password');
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    res.json({ admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Admin Profile (NEW)
exports.updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const { name } = req.body;
    if (name) admin.name = name;

    if (req.file) {
      admin.profileImage = req.file.path.replace(/\\/g, "/");
    }

    await admin.save();
    // Return without password
    const adminResponse = await Admin.findById(admin._id).select('-password');
    res.json({ message: 'Profile updated', admin: adminResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// ADMIN ANNOUNCEMENT OPERATIONS
// ============================================

// Admin creates announcement (alternative to announcementController)
exports.createAnnouncementAsAdmin = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const { title, message, expiresAt } = req.body;
    if (!title || !message) return res.status(400).json({ error: 'title and message required' });

    const ann = await Announcement.create({ title, message, createdBy: adminId, expiresAt });
    res.status(201).json({ message: 'Announcement created', announcement: ann });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all announcements for admin
exports.listAnnouncementsForAdmin = async (req, res) => {
  try {
    const list = await Announcement.find().sort({ createdAt: -1 }).populate('createdBy', 'name email');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// ADMIN MANAGES STUDENTS
// ============================================

// Get all students (Admin only)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-__v').sort({ createdAt: -1 });
    res.json({ students });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single student by ID (Admin only)
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-__v');
    if (!student) return res.status(404).json({ error: 'Student not found' });

    res.json({ student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update student (Admin only)
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, studentId, department, year } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    if (name) student.name = name;
    if (email) student.email = email;
    if (studentId) student.studentId = studentId;
    if (department) student.department = department;
    if (year) student.year = year;

    await student.save();

    res.json({ message: 'Student updated successfully', student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete student (Admin only)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};