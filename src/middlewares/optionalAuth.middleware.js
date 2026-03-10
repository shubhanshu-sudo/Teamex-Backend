const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model');

/**
 * Optionally attach admin to request if valid JWT is present.
 * Does not reject request if no token or invalid token.
 */
const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    if (admin) req.admin = admin;
  } catch (_) {
    // ignore invalid token
  }
  next();
};

module.exports = { optionalAuth };
