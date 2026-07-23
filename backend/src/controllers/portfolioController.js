const portfolioService = require('../services/portfolioService');
const { success } = require('../utils/apiResponse');

async function getSummary(req, res, next) {
  try {
    const summary = await portfolioService.getSummary(req.user);
    return success(res, 200, 'Portfolio summary retrieved successfully.', { summary });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getSummary };
