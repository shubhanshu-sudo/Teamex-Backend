const express = require('express');
const { create, list, update, remove } = require('../controllers/category.controller');
const { protect } = require('../middlewares/auth.middleware');
const { optionalAuth } = require('../middlewares/optionalAuth.middleware');

const router = express.Router();

router.get('/', optionalAuth, list);
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

module.exports = router;
