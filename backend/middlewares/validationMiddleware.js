// middlewares/validationMiddleware.js
const { body, param, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// ============================================
// ADMIN VALIDATIONS
// ============================================

const validateAdminRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),
  
  handleValidationErrors
];

const validateAdminLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  handleValidationErrors
];

// ============================================
// STUDENT VALIDATIONS
// ============================================

const validateStudentRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('studentId')
    .trim()
    .notEmpty().withMessage('Student ID is required')
    .isLength({ min: 3, max: 20 }).withMessage('Student ID must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/i).withMessage('Student ID must contain only letters and numbers'),
  
  body('department')
    .trim()
    .notEmpty().withMessage('Department is required')
    .isLength({ min: 2, max: 100 }).withMessage('Department must be between 2 and 100 characters'),
  
  body('year')
    .trim()
    .notEmpty().withMessage('Year is required')
    .isLength({ min: 4, max: 4 }).withMessage('Year must be 4 digits (e.g., 2024)')
    .matches(/^\d{4}$/).withMessage('Year must be a valid 4-digit number'),
  
  handleValidationErrors
];

const validateStudentLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('studentId')
    .trim()
    .notEmpty().withMessage('Student ID is required'),
  
  handleValidationErrors
];

const validateVerifyOTP = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('otp')
    .trim()
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
    .isNumeric().withMessage('OTP must contain only numbers'),
  
  handleValidationErrors
];

// ============================================
// EVENT VALIDATIONS
// ============================================

const validateCreateEvent = [
  body('title')
    .trim()
    .notEmpty().withMessage('Event title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
  
  body('date')
    .notEmpty().withMessage('Event date is required')
    .isISO8601().withMessage('Please provide a valid date (YYYY-MM-DD)')
    .custom((value) => {
      const eventDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        throw new Error('Event date cannot be in the past');
      }
      return true;
    }),
  
  body('time')
    .optional()
    .trim()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM|am|pm)?$/)
    .withMessage('Please provide valid time format (e.g., 10:00 AM)'),
  
  body('location')
    .trim()
    .notEmpty().withMessage('Event location is required')
    .isLength({ min: 3, max: 200 }).withMessage('Location must be between 3 and 200 characters'),
  
  body('maxParticipants')
    .optional()
    .isInt({ min: 1, max: 10000 }).withMessage('Max participants must be between 1 and 10000'),
  
  body('registrationDeadline')
    .optional()
    .isISO8601().withMessage('Please provide a valid registration deadline (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (value && req.body.date) {
        const deadline = new Date(value);
        const eventDate = new Date(req.body.date);
        if (deadline >= eventDate) {
          throw new Error('Registration deadline must be before event date');
        }
      }
      return true;
    }),
  
  handleValidationErrors
];

const validateUpdateEvent = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
  
  body('date')
    .optional()
    .isISO8601().withMessage('Please provide a valid date (YYYY-MM-DD)'),
  
  body('time')
    .optional()
    .trim()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM|am|pm)?$/)
    .withMessage('Please provide valid time format'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Location must be between 3 and 200 characters'),
  
  body('maxParticipants')
    .optional()
    .isInt({ min: 1, max: 10000 }).withMessage('Max participants must be between 1 and 10000'),
  
  body('registrationDeadline')
    .optional()
    .isISO8601().withMessage('Please provide a valid registration deadline'),
  
  handleValidationErrors
];

// ============================================
// ANNOUNCEMENT VALIDATIONS
// ============================================

const validateCreateAnnouncement = [
  body('title')
    .trim()
    .notEmpty().withMessage('Announcement title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Announcement message is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters'),
  
  body('expiresAt')
    .optional()
    .isISO8601().withMessage('Please provide a valid expiry date')
    .custom((value) => {
      const expiryDate = new Date(value);
      const now = new Date();
      if (expiryDate <= now) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),
  
  handleValidationErrors
];

const validateUpdateAnnouncement = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('message')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters'),
  
  body('expiresAt')
    .optional()
    .isISO8601().withMessage('Please provide a valid expiry date'),
  
  handleValidationErrors
];

// ============================================
// STUDENT PROFILE VALIDATIONS
// ============================================

const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Department must be between 2 and 100 characters'),
  
  body('year')
    .optional()
    .trim()
    .matches(/^\d{4}$/).withMessage('Year must be a valid 4-digit number'),
  
  handleValidationErrors
];

// ============================================
// ID VALIDATIONS
// ============================================

const validateMongoId = (paramName = 'id') => [
  param(paramName)
    .isMongoId().withMessage('Invalid ID format'),
  
  handleValidationErrors
];

module.exports = {
  // Admin
  validateAdminRegister,
  validateAdminLogin,
  
  // Student
  validateStudentRegister,
  validateStudentLogin,
  validateVerifyOTP,
  validateUpdateProfile,
  
  // Events
  validateCreateEvent,
  validateUpdateEvent,
  
  // Announcements
  validateCreateAnnouncement,
  validateUpdateAnnouncement,
  
  // General
  validateMongoId,
  handleValidationErrors
};