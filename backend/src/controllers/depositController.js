const { v4: uuidv4 } = require('uuid');
const depositModel = require('../models/depositModel');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');
const { success } = require('../utils/apiResponse');

function generateReference() {
  return `DEP-${uuidv4().split('-')[0].toUpperCase()}`;
}

async function getMyDeposits(req, res, next) {
  try {
    const deposits = await depositModel.findByUser(req.user.id);
    return success(res, 200, 'Deposit requests retrieved successfully.', { deposits });
  } catch (error) {
    return next(error);
  }
}

async function createDeposit(req, res, next) {
  try {
    const { amount, method, notes } = req.body;
    const reference = generateReference();

    const deposit = await depositModel.create({
      userId: req.user.id,
      amount,
      method,
      notes,
      reference
    });

    // Notify admin/operations inbox. Failure to send email must never
    // block the client's request from succeeding.
    emailService
      .notifyAdminOfDepositRequest(req.user, deposit)
      .catch((error) => logger.error(`Failed to notify admin of deposit request: ${error.message}`));

    return success(res, 201, 'Deposit request submitted successfully.', { deposit });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getMyDeposits, createDeposit };
