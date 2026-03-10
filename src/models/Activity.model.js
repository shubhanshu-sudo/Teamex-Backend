const mongoose = require('mongoose');
const { generateSlug } = require('../utils/slugify');

const activitySchema = new mongoose.Schema(
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
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
    },
    duration: {
      type: String,
      trim: true,
      maxlength: [50, 'e.g. 2 hours, 1 day'],
    },
    locationType: {
      type: String,
      trim: true,
      maxlength: [100, 'e.g. Indoor, Outdoor, Hybrid'],
    },
    intensity: {
      type: String,
      trim: true,
      enum: ['low', 'medium', 'high', ''],
      default: '',
    },
    featuredImage: {
      url: { type: String },
      publicId: { type: String },
    },
    galleryImages: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [70, 'SEO title should be under 70 characters'],
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta description should be under 160 characters'],
    },
    metaTitle: { type: String, trim: true, maxlength: 70 },
    metaDescription: { type: String, trim: true, maxlength: 160 },
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

activitySchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title);
  }
  next();
});

activitySchema.index({ status: 1 });
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
