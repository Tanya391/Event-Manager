// controllers/studentController.js
const Student = require('../models/Student');
const Event = require('../models/Event');

// Get student profile (student must be authenticated; middleware sets req.student)
exports.getMyProfile = async (req, res) => {
  try {
    const studentId = req.student._id;
    
    const student = await Student.findById(studentId).select('-__v');
    if (!student) return res.status(404).json({ error: 'Student not found' });

    res.json({ student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get events the student is registered for
exports.getMyRegistrations = async (req, res) => {
  try {
    const student = req.student;
    
    // find events where participants array contains this student's studentId or email
    const events = await Event.find({
      $or: [
        { 'participants.studentId': student.studentId },
        { 'participants.email': student.email }
      ]
    });

    res.json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update student profile
exports.updateMyProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);
    if (!student) return res.status(401).json({ error: 'Unauthorized' });

    const { name, department, year } = req.body;
    if (name) student.name = name;
    if (department) student.department = department;
    if (year) student.year = year;

    await student.save();
    res.json({ message: 'Profile updated', student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};