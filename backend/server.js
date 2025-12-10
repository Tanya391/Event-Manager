// Load Environment Variables
require("dotenv").config();

// Imports
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const eventRoutes = require("./routes/eventRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// Initialize App
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use(helmet());
app.disable("x-powered-by");

// Connect Database
connectDB();

// Create Default Admin (Only if not exists)
async function createDefaultAdmin() {
  try {
    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_DEFAULT_EMAIL,
    });

    if (!existingAdmin) {
      const admin = new Admin({
        name: "Super Admin",
        email: process.env.ADMIN_DEFAULT_EMAIL,
        password: process.env.ADMIN_DEFAULT_PASSWORD,
      });

      await admin.save();
      console.log("✅ Default Admin Created");
    } else {
      console.log("ℹ Default Admin Already Exists");
    }
  } catch (err) {
    console.error("Error creating default admin:", err.message);
  }
}

createDefaultAdmin();

// Route Mounting
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("College Management Portal Backend Running ✔");
});

// Global Error Handler (Optional but recommended)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);