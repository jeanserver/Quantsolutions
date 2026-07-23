const express = require('express');
const { getMyWithdrawals, createWithdrawal } = require('../controllers/withdrawalController');
const authMiddleware = require('../middleware/authMiddleware');
const { transactionRateLimiter } = require('../middleware/rateLimiter');
const { withdrawalValidator } = require('../validators/withdrawalValidator');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMyWithdrawals);
router.post('/', transactionRateLimiter, withdrawalValidator, validateRequest, createWithdrawal);

module.exports = router;
