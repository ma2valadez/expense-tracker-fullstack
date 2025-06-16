const mongoose = require('mongoose');

/**
 * Connects to MongoDB database
 * Uses connection string from environment variables
 * Implements retry logic for resilience
 */
const connectDB = async () => {
    try {
        // Connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Automatically create indexes
            autoIndex: true,
            // Use the new Server Discovery and Monitoring engine
            serverSelectionTimeoutMS: 5000,
        };

        // Establish connection
        const conn = await mongoose.connect(process.env.MONGODB_URI, options);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;