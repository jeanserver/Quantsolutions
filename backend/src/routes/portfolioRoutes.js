const express = require('express');
const { getSummary } = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', authMiddleware, getSummary);

module.exports = router;
