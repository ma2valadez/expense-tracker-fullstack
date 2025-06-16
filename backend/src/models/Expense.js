const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide expense title'],
        trim: true,
        maxLength: [100, 'Title cannot exceed 100 characters']
    },
    amount: {
        type: Number,
        required: [true, 'Please provide expense amount'],
        min: [0, 'Amount cannot be negative']
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
                'Other'
            ],
            message: '{VALUE} is not a valid category'
        }
    },
    description: {
        type: String,
        maxLength: [500, 'Description cannot exceed 500 characters']
    },
    date: {
        type: Date,
        required: [true, 'Please provide expense date'],
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);