const Lead = require('../models/Lead.model');
const { validateContact } = require('../validations/contact.validation');

/**
 * POST /api/contact - Public contact form (creates lead)
 */
exports.createFromContact = async (req, res, next) => {
  try {
    const errors = validateContact(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join('. ') });
    }
    const lead = await Lead.create({
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      phone: (req.body.phone || '').trim(),
      company: (req.body.company || '').trim(),
      message: req.body.message.trim(),
      source: 'contact_form',
    });
    res.status(201).json({
      success: true,
      message: 'Thank you. We will get back to you soon.',
      data: { id: lead._id },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/leads - List leads (protected, for admin dashboard)
 */
exports.list = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    const [items, total] = await Promise.all([
      Lead.find(statusFilter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Lead.countDocuments(statusFilter),
    ]);
    res.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/leads/:id - Get single lead (protected)
 */
exports.getOne = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).lean();
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/leads/:id - Update lead status (protected)
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['new', 'contacted', 'qualified', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};
