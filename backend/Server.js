require('dotenv').config();

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

// Simple request logger (helps debugging)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} -> ${req.method} ${req.originalUrl}`);
    next();
});

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health endpoint for quick checks
app.get('/api/health', (req, res) => {
    return res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/items', require('./src/routes/items'));
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/sales', require('./src/routes/sales'));
app.use('/api/auth', require('./src/routes/auth'));

// Force-set CORS headers as a fallback (helps detect middleware ordering issues)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // If a preflight request, end early
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

// Debug route: returns the headers the server sees
app.get('/api/debug/headers', (req, res) => {
    return res.status(200).json({ headers: req.headers });
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
