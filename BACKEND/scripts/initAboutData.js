const mongoose = require('mongoose');
require('dotenv').config();

const defaultAboutData = {
    title: "HealingWave Health Service",
    description: "Your trusted healthcare partner providing comprehensive medical services.",
    mission: "Delivering compassionate healthcare with state-of-the-art technology and skilled professionals.",
    vision: "To be the leading healthcare provider known for excellence and innovation in patient care.",
    achievements: [
        "24/7 Emergency Care",
        "Advanced Surgical Units",
        "Rehabilitation & Diagnostics",
        "Doctor & Patient Portals",
        "Telemedicine Services"
    ]
};

async function initAboutData() {
    try {
        await mongoose.connect(process.env.ATLAS_URI);
        console.log('Connected to MongoDB');

        const About = require('../models/About');
        
        // Clear existing data
        await About.deleteMany({});
        
        // Insert default data
        const newAbout = new About(defaultAboutData);
        await newAbout.save();
        
        console.log('Default about data inserted successfully');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

initAboutData(); 