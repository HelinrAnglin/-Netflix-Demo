const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS - allow all origins in development
app.use(cors({ origin: '*' }));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve admin static files
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// API routes
app.use('/api', routes);

// API 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', message: 'API 端点不存在' });
});

// SPA fallback for admin - serve index.html for non-file admin routes
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/index.html'));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
