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
const userInvestmentModel = require('../models/userInvestmentModel');
const { updateValueValidator } = require('../validators/userInvestmentValidator');
const { success, failure } = require('../utils/apiResponse');
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

// Client plan selections: approve/reject, and manually update each client's
// current portfolio value to reflect real, admin-tracked performance.
router.get('/plan-selections', async (req, res, next) => {
  try {
    const selections = await userInvestmentModel.findAll();
    return success(res, 200, 'Plan selections retrieved successfully.', { selections });
  } catch (error) {
    return next(error);
  }
});

router.put('/plan-selections/:id/approve', async (req, res, next) => {
  try {
    const updated = await userInvestmentModel.updateStatus(req.params.id, 'active');
    if (!updated) return failure(res, 404, 'Plan selection not found.');
    return success(res, 200, 'Plan selection approved.', { selection: updated });
  } catch (error) {
    return next(error);
  }
});

router.put('/plan-selections/:id/reject', async (req, res, next) => {
  try {
    const updated = await userInvestmentModel.updateStatus(req.params.id, 'rejected');
    if (!updated) return failure(res, 404, 'Plan selection not found.');
    return success(res, 200, 'Plan selection rejected.', { selection: updated });
  } catch (error) {
    return next(error);
  }
});

router.put(
  '/plan-selections/:id/value',
  updateValueValidator,
  validateRequest,
  async (req, res, next) => {
    try {
      const { currentValue, notes } = req.body;
      const updated = await userInvestmentModel.updateValue(req.params.id, currentValue, notes);
      if (!updated) return failure(res, 404, 'Plan selection not found.');
      return success(res, 200, "Client's portfolio value updated.", { selection: updated });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
