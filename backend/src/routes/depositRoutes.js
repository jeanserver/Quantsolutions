const express = require('express');
const { getMyDeposits, createDeposit } = require('../controllers/depositController');
const authMiddleware = require('../middleware/authMiddleware');
const { transactionRateLimiter } = require('../middleware/rateLimiter');
const { depositValidator } = require('../validators/depositValidator');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMyDeposits);
router.post('/', transactionRateLimiter, depositValidator, validateRequest, createDeposit);

module.exports = router;
