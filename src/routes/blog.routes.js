const express = require('express');
const {
  create,
  list,
  getById,
  getBySlug,
  update,
  remove,
} = require('../controllers/blog.controller');
const { protect } = require('../middlewares/auth.middleware');
const { optionalAuth } = require('../middlewares/optionalAuth.middleware');
const { uploadBlogImage } = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', optionalAuth, list);
router.get('/id/:id', protect, getById);
router.get('/:slug', optionalAuth, getBySlug);

router.post('/', protect, uploadBlogImage.single('featuredImage'), create);
router.put('/:id', protect, uploadBlogImage.single('featuredImage'), update);
router.delete('/:id', protect, remove);

module.exports = router;
