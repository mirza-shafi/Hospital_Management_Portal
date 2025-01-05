const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    mission: {
        type: String,
        required: [true, 'Mission statement is required']
    },
    vision: {
        type: String,
        required: [true, 'Vision statement is required']
    },
    achievements: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('About', aboutSchema);
