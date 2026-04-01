const express = require('express');
const router = express.Router();
const { compareCode } = require('../controllers/compareController');
const auth = require('../middleware/authMiddleware');

router.post('/compare', auth, compareCode);

module.exports = router;
