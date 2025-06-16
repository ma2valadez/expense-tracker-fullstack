const { validationResult } = require('express-validator');

/**
 * Validation middleware
 * Checks for validation errors from express-validator
 */
exports.validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.param,
            message: error.msg,
        }));

        return res.status(400).json({
            success: false,
            errors: errorMessages,
        });
    }

    next();
};