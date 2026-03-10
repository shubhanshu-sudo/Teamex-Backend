const Activity = require('../models/Activity.model');
const { generateSlug } = require('../utils/slugify');

/**
 * POST /api/activities - Create activity (protected)
 */
exports.create = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (req.file) {
      body.featuredImage = { url: req.file.path, publicId: req.file.filename };
    }
    if (body.title && !body.slug) body.slug = generateSlug(body.title);
    const activity = await Activity.create(body);
    res.status(201).json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/activities - List (public: published only, admin: all with ?all=true)
 */
exports.list = async (req, res, next) => {
  try {
    const isAdmin = req.admin;
    const query = isAdmin && req.query.all === 'true' ? {} : { status: 'published' };
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Activity.find(query).populate('category', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Activity.countDocuments(query),
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
 * GET /api/activities/id/:id - Get by id (protected, for admin edit)
 */
exports.getById = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('category', 'name slug').lean();
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found.' });
    }
    res.json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/activities/:slug - Get by slug (public: published only)
 */
exports.getBySlug = async (req, res, next) => {
  try {
    const isAdmin = req.admin;
    const query = { slug: req.params.slug };
    if (!isAdmin) query.status = 'published';
    const activity = await Activity.findOne(query).populate('category', 'name slug').lean();
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found.' });
    }
    res.json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/activities/:id - Update (protected)
 */
exports.update = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (req.file) {
      body.featuredImage = { url: req.file.path, publicId: req.file.filename };
    }
    if (body.title && !body.slug) body.slug = generateSlug(body.title);
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true, runValidators: true }
    );
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found.' });
    }
    res.json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/activities/:id (protected)
 */
exports.remove = async (req, res, next) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found.' });
    }
    res.json({ success: true, message: 'Activity deleted.' });
  } catch (err) {
    next(err);
  }
};
