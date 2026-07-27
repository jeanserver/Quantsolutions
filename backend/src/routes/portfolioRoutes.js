const express = require('express');
const { getSummary, getOverview } = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', authMiddleware, getSummary);
router.get('/overview', authMiddleware, getOverview);

module.exports = router;
