const Expense = require('../models/Expense');

/**
 * @desc    Get all expenses for logged in user
 * @route   GET /api/expenses
 * @access  Private
 */
exports.getExpenses = async (req, res, next) => {
    try {
        // Parse query parameters
        const { category, startDate, endDate, limit = 50, page = 1 } = req.query;

        // Build query
        const query = { user: req.user.id };

        if (category) {
            query.category = category;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Execute query with pagination
        const expenses = await Expense.find(query)
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        // Get total count for pagination
        const count = await Expense.countDocuments(query);

        // Calculate total amount
        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        res.status(200).json({
            success: true,
            count: expenses.length,
            total: count,
            totalAmount,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(count / limit),
            },
            data: expenses,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single expense
 * @route   GET /api/expenses/:id
 * @access  Private
 */
exports.getExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found',
            });
        }

        // Check ownership
        if (expense.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this expense',
            });
        }

        res.status(200).json({
            success: true,
            data: expense,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new expense
 * @route   POST /api/expenses
 * @access  Private
 */
exports.createExpense = async (req, res, next) => {
    try {
        // Add user to request body
        req.body.user = req.user.id;

        const expense = await Expense.create(req.body);

        res.status(201).json({
            success: true,
            data: expense,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update expense
 * @route   PUT /api/expenses/:id
 * @access  Private
 */
exports.updateExpense = async (req, res, next) => {
    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found',
            });
        }

        // Check ownership
        if (expense.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this expense',
            });
        }

        // Update expense
        expense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            data: expense,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete expense
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
exports.deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found',
            });
        }

        // Check ownership
        if (expense.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this expense',
            });
        }

        await expense.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get expense statistics
 * @route   GET /api/expenses/stats
 * @access  Private
 */
exports.getExpenseStats = async (req, res, next) => {
    try {
        const { year, month } = req.query;

        // Date range for statistics
        let startDate, endDate;

        if (year && month) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0);
        } else if (year) {
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31);
        } else {
            // Current year by default
            const currentYear = new Date().getFullYear();
            startDate = new Date(currentYear, 0, 1);
            endDate = new Date(currentYear, 11, 31);
        }

        // Get statistics by category
        const categoryStats = await Expense.getStatsByUser(
            req.user._id,
            startDate,
            endDate
        );

        // Get monthly statistics
        const monthlyStats = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                    },
                    totalAmount: { $sum: '$amount' },
                    count: { $count: {} },
                },
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    totalAmount: { $divide: ['$totalAmount', 100] },
                    count: 1,
                },
            },
            { $sort: { year: 1, month: 1 } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                categoryStats,
                monthlyStats,
                dateRange: {
                    start: startDate,
                    end: endDate,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Bulk create expenses
 * @route   POST /api/expenses/bulk
 * @access  Private
 */
exports.bulkCreateExpenses = async (req, res, next) => {
    try {
        const { expenses } = req.body;

        if (!Array.isArray(expenses) || expenses.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of expenses',
            });
        }

        // Add user to each expense
        const expensesWithUser = expenses.map(expense => ({
            ...expense,
            user: req.user.id,
        }));

        const createdExpenses = await Expense.insertMany(expensesWithUser, {
            ordered: false, // Continue on error
            rawResult: true,
        });

        res.status(201).json({
            success: true,
            count: createdExpenses.insertedCount,
            data: createdExpenses.ops,
        });
    } catch (error) {
        next(error);
    }
};