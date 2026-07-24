const express = require('express');
const {
  listAllDeposits,
  listAllWithdrawals,
  updateDepositStatus,
  updateWithdrawalStatus
} = require('../controllers/adminController');
const {
  createInvestment,
  updateInvestment,
  deleteInvestment
} = require('../controllers/investmentController');
const { investmentWriteValidator } = require('../validators/investmentValidator');
const validateRequest = require('../middleware/validateRequest');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/deposits', listAllDeposits);
router.get('/withdrawals', listAllWithdrawals);
router.put('/deposits/:id/status', updateDepositStatus);
router.put('/withdrawals/:id/status', updateWithdrawalStatus);

router.post('/investments', investmentWriteValidator, validateRequest, createInvestment);
router.put('/investments/:id', investmentWriteValidator, validateRequest, updateInvestment);
router.delete('/investments/:id', deleteInvestment);

module.exports = router;
