const express = require('express');
const { list, getOne, updateStatus } = require('../controllers/lead.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', protect, list);
router.get('/:id', protect, getOne);
router.patch('/:id', protect, updateStatus);

module.exports = router;
