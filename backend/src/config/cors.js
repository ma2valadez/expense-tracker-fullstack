/**
 * CORS (Cross-Origin Resource Sharing) configuration
 * Allows frontend to communicate with backend
 */
const corsOptions = {
    origin: function (origin, callback) {
        // Allowed origins
        const allowedOrigins = [
            'http://localhost:3000',      // React development server
            'http://localhost:5000',      // Backend (for testing)
            process.env.CLIENT_URL,       // Production frontend URL
        ].filter(Boolean); // Remove any undefined values

        // Allow requests with no origin (mobile apps, Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 200, // For legacy browser support
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = corsOptions;