const depositModel = require('../models/depositModel');
const withdrawalModel = require('../models/withdrawalModel');
const { success, failure } = require('../utils/apiResponse');

async function listAllDeposits(req, res, next) {
  try {
    const deposits = await depositModel.findAll();
    return success(res, 200, 'All deposit requests retrieved successfully.', { deposits });
  } catch (error) {
    return next(error);
  }
}

async function listAllWithdrawals(req, res, next) {
  try {
    const withdrawals = await withdrawalModel.findAll();
    return success(res, 200, 'All withdrawal requests retrieved successfully.', { withdrawals });
  } catch (error) {
    return next(error);
  }
}

async function updateDepositStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return failure(res, 422, 'Status must be one of: pending, approved, rejected.');
    }

    const existing = await depositModel.findById(id);
    if (!existing) {
      return failure(res, 404, 'Deposit request not found.');
    }

    const deposit = await depositModel.updateStatus(id, status);
    return success(res, 200, 'Deposit status updated successfully.', { deposit });
  } catch (error) {
    return next(error);
  }
}

async function updateWithdrawalStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return failure(res, 422, 'Status must be one of: pending, approved, rejected.');
    }

    const existing = await withdrawalModel.findById(id);
    if (!existing) {
      return failure(res, 404, 'Withdrawal request not found.');
    }

    const withdrawal = await withdrawalModel.updateStatus(id, status);
    return success(res, 200, 'Withdrawal status updated successfully.', { withdrawal });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listAllDeposits,
  listAllWithdrawals,
  updateDepositStatus,
  updateWithdrawalStatus
};
