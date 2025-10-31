require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize database
const { connectDB } = require('../server/database');
connectDB();

// Import routes
const authRoutes = require('../server/routes/auth');
const coursesRoutes = require('../server/routes/courses');
const battlesRoutes = require('../server/routes/battles');
const aiRoutes = require('../server/routes/ai');
const projectsRoutes = require('../server/routes/projects');
const internshipsRoutes = require('../server/routes/internships');
const adminRoutes = require('../server/routes/admin');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "https://inturnx.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../server/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/battles', battlesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/internships', internshipsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'InturnX Server is running' });
});

module.exports = app;

