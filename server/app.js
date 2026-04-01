const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/code', require('./routes/codeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/ai', require('./routes/compareRoutes'));

// Basic health check route
app.get('/', (req, res) => {
  res.send('AI Code Analyzer API is running...');
});

module.exports = app;
