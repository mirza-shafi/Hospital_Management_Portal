const express = require('express');
const router = express.Router();
const About = require('../models/About');

// Default about data
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

// GET about information
router.get('/', async (req, res) => {
    try {
        let aboutInfo = await About.findOne();
        
        if (!aboutInfo) {
            aboutInfo = new About(defaultAboutData);
            await aboutInfo.save();
        }

        res.json({
            success: true,
            data: aboutInfo
        });
    } catch (error) {
        console.error('Error in about route:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching about information',
            error: error.message
        });
    }
});

module.exports = router;
