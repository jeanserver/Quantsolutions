const express = require('express');
const { getMyTransactions } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMyTransactions);

module.exports = router;
