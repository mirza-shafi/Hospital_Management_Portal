require('dotenv').config();
const express = require('express');
const connectDB = require('./dbconnect');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5001;

// Connect to MongoDB first
connectDB().then(() => {
    console.log('Database connection established');
}).catch(err => {
    console.error('Database connection failed:', err);
    // process.exit(1);
});

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// CORS configuration
app.use(cors({
    origin: ['http://localhost:1001', 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Root route
app.get('/', (req, res) => {
    res.send('Hospital Management Portal Backend is Running!');
});

// Routes
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/medicineBill', require('./routes/medicineBill'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/healthcards', require('./routes/healthcards'));
app.use('/api/bloodDonor', require('./routes/bloodDonor'));
app.use('/api/bloodRecipient', require('./routes/bloodRecipient'));
app.use('/api/bloodAvailability', require('./routes/bloodAvailability'));
app.use('/api/wardBooking', require('./routes/wardBooking'));
app.use('/api/cabinBooking', require('./routes/cabinBooking'));
app.use('/api/testOrService', require('./routes/testOrService'));
app.use('/api/testAndServicesBill', require('./routes/testAndServicesBill'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/support', require('./routes/support'));
app.use('/api/about', require('./routes/about'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/equipment', require('./routes/equipment'));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

