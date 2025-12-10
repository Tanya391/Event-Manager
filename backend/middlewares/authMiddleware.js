const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const TokenBlacklist = require("../models/TokenBlacklist");
// Admin Verification
exports.verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Check if token is blacklisted
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ error: "Token expired or logged out" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({ error: "Not authorized" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Student Verification
exports.verifyStudent = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ error: "Token expired or logged out" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findById(decoded.id);
    if (!student) {
      return res.status(401).json({ error: "Not authorized" });
    }

    req.student = student;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
