const express = require('express');
const {
  create,
  list,
  getById,
  getBySlug,
  update,
  remove,
} = require('../controllers/activity.controller');
const { protect } = require('../middlewares/auth.middleware');
const { optionalAuth } = require('../middlewares/optionalAuth.middleware');
const { uploadActivityImage } = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', optionalAuth, list);
router.get('/id/:id', protect, getById);
router.get('/:slug', optionalAuth, getBySlug);

router.post('/', protect, uploadActivityImage.single('featuredImage'), create);
router.put('/:id', protect, uploadActivityImage.single('featuredImage'), update);
router.delete('/:id', protect, remove);

module.exports = router;
