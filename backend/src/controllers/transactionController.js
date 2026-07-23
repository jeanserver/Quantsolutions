const transactionModel = require('../models/transactionModel');
const { success } = require('../utils/apiResponse');

async function getMyTransactions(req, res, next) {
  try {
    const transactions = await transactionModel.findByUser(req.user.id);
    return success(res, 200, 'Transactions retrieved successfully.', { transactions });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getMyTransactions };
