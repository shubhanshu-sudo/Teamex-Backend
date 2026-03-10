const Category = require('../models/Category.model');

/**
 * POST /api/categories - Create (protected)
 */
exports.create = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/categories - List all (public can list active; admin can list all with ?all=true)
 */
exports.list = async (req, res, next) => {
  try {
    const isAdmin = req.admin;
    const query = isAdmin && req.query.all === 'true' ? {} : { status: 'active' };
    const categories = await Category.find(query).sort({ name: 1 }).lean();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/categories/:id - Update (protected)
 */
exports.update = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/categories/:id (protected)
 */
exports.remove = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    next(err);
  }
};
