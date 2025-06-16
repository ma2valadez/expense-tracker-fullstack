const mongoose = require('mongoose');

/**
 * Expense Schema
 * Defines the structure of expense documents
 */
const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true, // Index for faster queries
    },
    title: {
        type: String,
        required: [true, 'Please provide expense title'],
        trim: true,
        maxLength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
        type: Number,
        required: [true, 'Please provide expense amount'],
        min: [0, 'Amount cannot be negative'],
        // Store as cents to avoid floating point issues
        get: v => v / 100,
        set: v => Math.round(v * 100),
    },
    category: {
        type: String,
        required: [true, 'Please provide expense category'],
        enum: {
            values: [
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
                'Other'
            ],
            message: '{VALUE} is not a valid category',
        },
    },
    description: {
        type: String,
        maxLength: [500, 'Description cannot exceed 500 characters'],
        default: '',
    },
    date: {
        type: Date,
        required: [true, 'Please provide expense date'],
        default: Date.now,
        index: true, // Index for date-based queries
    },
    isRecurring: {
        type: Boolean,
        default: false,
    },
    recurringInterval: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: function() { return this.isRecurring; },
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true,
    }],
    attachments: [{
        filename: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    }],
}, {
    timestamps: true,
    toJSON: { getters: true }, // Apply getters when converting to JSON
});

// Compound indexes for complex queries
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ user: 1, 'tags': 1 });

/**
 * Virtual for formatted amount
 * Provides amount as currency string
 */
expenseSchema.virtual('formattedAmount').get(function() {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(this.amount);
});

/**
 * Static method to get expense statistics
 * Available on the model itself
 */
expenseSchema.statics.getStatsByUser = async function(userId, startDate, endDate) {
    const match = { user: userId };

    if (startDate || endDate) {
        match.date = {};
        if (startDate) match.date.$gte = startDate;
        if (endDate) match.date.$lte = endDate;
    }

    const stats = await this.aggregate([
        { $match: match },
        {
            $group: {
                _id: '$category',
                totalAmount: { $sum: '$amount' },
                count: { $count: {} },
                avgAmount: { $avg: '$amount' },
            },
        },
        {
            $project: {
                category: '$_id',
                totalAmount: { $divide: ['$totalAmount', 100] },
                count: 1,
                avgAmount: { $divide: ['$avgAmount', 100] },
                _id: 0,
            },
        },
        { $sort: { totalAmount: -1 } },
    ]);

    return stats;
};

// Create and export model
const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;