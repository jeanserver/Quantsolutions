const express = require('express');
const {
  listAllDeposits,
  listAllWithdrawals,
  updateDepositStatus,
  updateWithdrawalStatus
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/deposits', listAllDeposits);
router.get('/withdrawals', listAllWithdrawals);
router.put('/deposits/:id/status', updateDepositStatus);
router.put('/withdrawals/:id/status', updateWithdrawalStatus);

module.exports = router;
