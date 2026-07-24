const express = require('express');
const { listInvestments } = require('../controllers/investmentController');
const { listInvestmentsValidator } = require('../validators/investmentValidator');
const validateRequest = require('../middleware/validateRequest');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Requires a logged-in client. Only authenticated users can view the
// investment plan catalog — plans no longer show up on public pages.
router.get('/', authMiddleware, listInvestmentsValidator, validateRequest, listInvestments);

module.exports = router;
