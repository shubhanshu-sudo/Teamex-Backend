const express = require('express');
const { createFromContact } = require('../controllers/lead.controller');

const router = express.Router();

router.post('/', createFromContact);

module.exports = router;
