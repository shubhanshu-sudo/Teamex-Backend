const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Security: Helmet sets various HTTP headers
app.use(helmet());

// Rate limiting - general API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// Stricter limit for auth and contact
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts. Try again later.' },
});
app.use('/api/admin/login', authLimiter);
app.use('/api/admin/register', authLimiter);
app.use('/api/contact', authLimiter);

// CORS
// For now, allow all origins and send back the origin header dynamically.
// This is convenient for multi-environment setups (local, Vercel, etc.).
// If you want to lock this down later, replace `origin: true` with an
// explicit whitelist using CORS_ORIGINS / FRONTEND_URL.
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes will be mounted here (in server.js after connecting DB)

module.exports = app;
