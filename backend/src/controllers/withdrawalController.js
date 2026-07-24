const { v4: uuidv4 } = require('uuid');
const withdrawalModel = require('../models/withdrawalModel');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');
const { success } = require('../utils/apiResponse');

function generateReference() {
  return `WDR-${uuidv4().split('-')[0].toUpperCase()}`;
}

async function getMyWithdrawals(req, res, next) {
  try {
    const withdrawals = await withdrawalModel.findByUser(req.user.id);
    return success(res, 200, 'Withdrawal requests retrieved successfully.', { withdrawals });
  } catch (error) {
    return next(error);
  }
}

async function createWithdrawal(req, res, next) {
  try {
    const { amount, method, bankName, accountName, accountNumber, walletAddress, notes } = req.body;
    const reference = generateReference();

    const withdrawal = await withdrawalModel.create({
      userId: req.user.id,
      amount,
      method,
      bankName,
      accountName,
      accountNumber,
      walletAddress,
      notes,
      reference
    });

    emailService
      .notifyAdminOfWithdrawalRequest(req.user, withdrawal)
      .catch((error) =>
        logger.error(`Failed to notify admin of withdrawal request: ${error.message}`)
      );

    return success(res, 201, 'Withdrawal request submitted successfully.', { withdrawal });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getMyWithdrawals, createWithdrawal };
