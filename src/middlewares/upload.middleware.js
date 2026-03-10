const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

/**
 * Reusable Cloudinary storage - single image
 * @param {string} folder - Cloudinary folder (e.g. 'teamex/activities', 'teamex/blogs')
 */
const createUploadMiddleware = (folder = 'teamex/uploads') => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ width: 1920, crop: 'limit', quality: 'auto' }],
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      const allowed = /image\/(jpeg|jpg|png|webp|gif)/;
      if (allowed.test(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed.'), false);
      }
    },
  });

  return upload;
};

// Pre-configured uploaders for each entity
const uploadActivityImage = createUploadMiddleware('teamex/activities');
const uploadBlogImage = createUploadMiddleware('teamex/blogs');
const uploadClientLogo = createUploadMiddleware('teamex/clients');
const uploadTeamImage = createUploadMiddleware('teamex/team');
const uploadTestimonialAvatar = createUploadMiddleware('teamex/testimonials');
const uploadGeneric = createUploadMiddleware('teamex/uploads');

module.exports = {
  createUploadMiddleware,
  uploadActivityImage,
  uploadBlogImage,
  uploadClientLogo,
  uploadTeamImage,
  uploadTestimonialAvatar,
  uploadGeneric,
};
