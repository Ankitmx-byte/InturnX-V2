const express = require('express');
const axios = require('axios');
const router = express.Router();

// AI Service proxy routes
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Course recommendations
router.post('/recommend', async (req, res) => {
  try {
    // Mock AI recommendations for now
    const recommendations = [
      {
        id: 1,
        title: 'Advanced React Patterns',
        description: 'Learn advanced React concepts and patterns',
        type: 'course'
      },
      {
        id: 2,
        title: 'Node.js Backend Development',
        description: 'Build scalable backend applications with Node.js',
        type: 'course'
      },
      {
        id: 3,
        title: 'Data Structures & Algorithms',
        description: 'Master DSA for technical interviews',
        type: 'course'
      }
    ];
    res.json({ recommendations });
  } catch (error) {
    console.error('AI recommendation error:', error.message);
    res.status(500).json({ message: 'AI service unavailable' });
  }
});

// Resume analysis
router.post('/analyze-resume', async (req, res) => {
  try {
    // Mock resume analysis
    const analysis = {
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      experience: '2-3 years',
      recommendations: [
        'Add more quantifiable achievements',
        'Include relevant certifications',
        'Highlight leadership experience'
      ]
    };
    res.json(analysis);
  } catch (error) {
    console.error('Resume analysis error:', error.message);
    res.status(500).json({ message: 'AI service unavailable' });
  }
});

// Code evaluation
router.post('/evaluate-code', async (req, res) => {
  try {
    // Mock code evaluation
    const evaluation = {
      score: 85,
      feedback: 'Good code structure and logic. Consider adding error handling and comments.',
      suggestions: [
        'Add input validation',
        'Implement error handling',
        'Add unit tests'
      ]
    };
    res.json(evaluation);
  } catch (error) {
    console.error('Code evaluation error:', error.message);
    res.status(500).json({ message: 'AI service unavailable' });
  }
});

// AI Mentor chat
router.post('/chat-mentor', async (req, res) => {
  try {
    // Mock AI mentor response
    const responses = [
      "That's a great question! Let me explain...",
      "Based on your current progress, I recommend focusing on...",
      "Here's a helpful resource to understand this concept better...",
      "Practice is key! Try implementing this concept in a small project."
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    res.json({ response: randomResponse });
  } catch (error) {
    console.error('AI mentor error:', error.message);
    res.status(500).json({ message: 'AI service unavailable' });
  }
});

module.exports = router;
