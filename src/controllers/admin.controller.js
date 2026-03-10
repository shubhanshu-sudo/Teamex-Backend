const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model');
const { validateRegister, validateLogin } = require('../validations/admin.validation');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * POST /api/admin/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const errors = validateRegister(name, email, password);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join('. ') });
    }
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }
    const admin = await Admin.create({ name: name.trim(), email: email.toLowerCase(), password });
    const token = generateToken(admin._id);
    res.status(201).json({
      success: true,
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validateLogin(email, password);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join('. ') });
    }
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const token = generateToken(admin._id);
    res.json({
      success: true,
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/profile (protected)
 */
exports.getProfile = async (req, res, next) => {
  try {
    res.json({ success: true, admin: req.admin });
  } catch (err) {
    next(err);
  }
};
