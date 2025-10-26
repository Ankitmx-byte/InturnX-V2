const express = require('express');
const { body } = require('express-validator');
const { signup, login, getProfile, createDemoAccount } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const signupValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Routes
router.post('/signup', signupValidation, signup);
router.post('/login', login);
router.post('/demo', createDemoAccount);
router.get('/profile', auth, getProfile);

module.exports = router;
