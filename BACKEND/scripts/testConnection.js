const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        await mongoose.connect(process.env.ATLAS_URI);
        console.log('Successfully connected to MongoDB Atlas');
        
        // Test the About model
        const About = require('../models/About');
        const count = await About.countDocuments();
        console.log(`Number of about documents: ${count}`);
        
        const aboutData = await About.find();
        console.log('About data:', aboutData);
        
    } catch (error) {
        console.error('Connection error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testConnection(); 