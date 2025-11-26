const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();

// Configure CORS for all routes
app.use(cors({
    origin: '*', // Allow all origins; change to your frontend URL in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use('/api/items', require('./src/routes/items'));
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/sales', require('./src/routes/sales'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
