const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');
const Course = require('../models/Course');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Submit project
router.post('/submit', auth, upload.single('zipFile'), async (req, res) => {
  try {
    const { courseId, githubLink } = req.body;
    const userId = req.user.id;

    if (!courseId || (!githubLink && !req.file)) {
      return res.status(400).json({ message: 'Course ID and either GitHub link or ZIP file are required' });
    }

    const project = new Project({
      userId,
      courseId,
      githubLink: githubLink || '',
      zipFile: req.file ? req.file.path : ''
    });

    await project.save();

    // Trigger AI analysis (mock for now)
    // In real implementation, this would call the AI service
    setTimeout(async () => {
      const aiScore = Math.floor(Math.random() * 40) + 60; // Random score 60-100
      const aiFeedback = 'Great project! Your code structure is well-organized and follows best practices. Consider adding more comprehensive error handling for production use.';

      // Update project with AI results
      await Project.findByIdAndUpdate(project._id, {
        aiScore,
        aiFeedback,
        status: 'reviewed'
      });

      console.log(`AI analysis completed for project ${project._id}: Score ${aiScore}`);
    }, 5000); // Simulate AI processing time

    res.status(201).json({
      message: 'Project submitted successfully',
      project: {
        id: project._id,
        status: 'submitted'
      }
    });
  } catch (error) {
    console.error('Project submission error:', error);
    res.status(500).json({ message: 'Failed to submit project' });
  }
});

// Get user projects
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is requesting their own projects or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const projects = await Project.find({ userId })
      .populate('courseId', 'title description')
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Get all projects (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const projects = await Project.find()
      .populate('userId', 'name email')
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Update project status (admin only)
router.patch('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, aiScore, aiFeedback } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status, aiScore, aiFeedback },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

module.exports = router;
