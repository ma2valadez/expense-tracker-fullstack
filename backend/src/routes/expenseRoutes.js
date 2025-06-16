const express = require('express');
const router = express.Router();
const {
    getExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseStats
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
    .get(getExpenses)
    .post(createExpense);

router.route('/stats')
    .get(getExpenseStats);

router.route('/:id')
    .get(getExpense)
    .put(updateExpense)
    .delete(deleteExpense);

module.exports = router;