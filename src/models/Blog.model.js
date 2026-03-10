const mongoose = require('mongoose');
const { generateSlug } = require('../utils/slugify');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: String,
      default: '',
    },
    featuredImage: {
      url: { type: String },
      publicId: { type: String },
    },
    author: {
      type: String,
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70, 'SEO title should be under 70 characters'],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta description should be under 160 characters'],
    },
    seoTitle: { type: String, trim: true, maxlength: 70 },
    seoDescription: { type: String, trim: true, maxlength: 160 },
    ogImage: { url: String, publicId: String },
    canonicalUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title);
  }
  next();
});

blogSchema.index({ status: 1 });
blogSchema.index({ publishDate: -1 });

module.exports = mongoose.model('Blog', blogSchema);
