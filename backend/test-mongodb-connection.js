const mongoose = require('mongoose');

async function testMongoDB() {
    console.log('🔍 Testing MongoDB connection...\n');

    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/expense-tracker-test');

        console.log('✅ Successfully connected to MongoDB!');
        console.log('📍 Connection details:');
        console.log(`   - Host: ${mongoose.connection.host}`);
        console.log(`   - Port: ${mongoose.connection.port}`);
        console.log(`   - Database: ${mongoose.connection.name}`);

        // Create a test collection and document
        const TestSchema = new mongoose.Schema({
            message: String,
            timestamp: { type: Date, default: Date.now }
        });

        const Test = mongoose.model('Test', TestSchema);

        // Create a test document
        const testDoc = await Test.create({
            message: 'MongoDB is working perfectly!'
        });

        console.log('\n✅ Test document created:', testDoc);

        // Clean up
        await Test.deleteMany({});
        await mongoose.connection.close();

        console.log('\n🎉 MongoDB test completed successfully!');
        console.log('💡 You can proceed with development.\n');

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('\nTroubleshooting tips:');
        console.error('1. Check if MongoDB service is running: Get-Service MongoDB');
        console.error('2. Try connecting with MongoDB Compass');
        console.error('3. Check Windows Firewall settings');
    }
}

// Run the test
testMongoDB();