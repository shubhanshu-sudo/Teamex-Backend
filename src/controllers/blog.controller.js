const Blog = require('../models/Blog.model');
const { generateSlug } = require('../utils/slugify');

/**
 * POST /api/blogs - Create blog (protected)
 */
exports.create = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (req.file) {
      body.featuredImage = { url: req.file.path, publicId: req.file.filename };
    }
    if (body.title && !body.slug) body.slug = generateSlug(body.title);
    const blog = await Blog.create(body);
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/blogs - List (public: published only, admin: all with ?all=true)
 */
exports.list = async (req, res, next) => {
  try {
    const isAdmin = req.admin;
    const query = isAdmin && req.query.all === 'true' ? {} : { status: 'published' };
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Blog.find(query).populate('category', 'name slug').sort({ publishDate: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(query),
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
 * GET /api/blogs/id/:id - Get by id (protected, for admin edit)
 */
exports.getById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('category', 'name slug').lean();
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/blogs/:slug - Get by slug (public: published only)
 */
exports.getBySlug = async (req, res, next) => {
  try {
    const isAdmin = req.admin;
    const query = { slug: req.params.slug };
    if (!isAdmin) query.status = 'published';
    const blog = await Blog.findOne(query).populate('category', 'name slug').lean();
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/blogs/:id - Update (protected)
 */
exports.update = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (req.file) {
      body.featuredImage = { url: req.file.path, publicId: req.file.filename };
    }
    if (body.title && !body.slug) body.slug = generateSlug(body.title);
    const blog = await Blog.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/blogs/:id (protected)
 */
exports.remove = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    res.json({ success: true, message: 'Blog deleted.' });
  } catch (err) {
    next(err);
  }
};
