const investmentService = require('../services/investmentService');
const { success } = require('../utils/apiResponse');

async function listInvestments(req, res, next) {
  try {
    const { category } = req.query;
    const investments = await investmentService.listInvestments(category);
    return success(res, 200, 'Investment plans retrieved successfully.', { investments });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listInvestments };
