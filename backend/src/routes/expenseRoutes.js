const express = require('express');
const { body, query } = require('express-validator');
const {
    getExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseStats,
    bulkCreateExpenses,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const expenseValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn([
            'Food',
            'Transportation',
            'Housing',
            'Entertainment',
            'Healthcare',
            'Shopping',
            'Education',
            'Utilities',
            'Insurance',
            'Savings',
            'Other',
        ]).withMessage('Invalid category'),
    body('date')
        .optional()
        .isISO8601().withMessage('Invalid date format'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

// All routes require authentication
router.use(protect);

// Routes
router.route('/')
    .get(getExpenses)
    .post(expenseValidation, validate, createExpense);

router.route('/bulk')
    .post(bulkCreateExpenses);

router.route('/stats')
    .get(getExpenseStats);

router.route('/:id')
    .get(getExpense)
    .put(expenseValidation, validate, updateExpense)
    .delete(deleteExpense);

module.exports = router;