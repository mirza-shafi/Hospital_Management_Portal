require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        await mongoose.connect(process.env.ATLAS_URI);
        console.log('Successfully connected to MongoDB');

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        // Test inserting a document
        const Test = mongoose.model('Test', new mongoose.Schema({ name: String }));
        await Test.create({ name: 'test' });
        console.log('Successfully inserted test document');

        // Clean up
        await mongoose.connection.db.collection('tests').drop();
        console.log('Cleaned up test collection');

    } catch (error) {
        console.error('Database test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

testConnection(); 