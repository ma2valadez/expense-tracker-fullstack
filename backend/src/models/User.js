const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Defines the structure of user documents in MongoDB
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxLength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: [6, 'Password must be at least 6 characters'],
        select: false, // Don't include password in queries by default
    },
    avatar: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    passwordResetToken: String,
    passwordResetExpire: Date,
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance
userSchema.index({ createdAt: -1 });

/**
 * Hash password before saving
 * This runs automatically before save()
 */
userSchema.pre('save', async function(next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

/**
 * Instance method to check password
 * Available on all user documents
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Instance method to get public profile
 * Removes sensitive fields
 */
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.passwordResetToken;
    delete user.passwordResetExpire;
    delete user.__v;
    return user;
};

// Create and export model
const User = mongoose.model('User', userSchema);
module.exports = User;