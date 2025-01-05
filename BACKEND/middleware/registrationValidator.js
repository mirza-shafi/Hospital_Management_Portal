const { check, validationResult } = require('express-validator');

const validateRegistration = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  check('sex')
    .notEmpty()
    .withMessage('Sex is required')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Invalid sex value'),
  
  check('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  check('mobileNumber')
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage('Invalid mobile number format'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = validateRegistration; 