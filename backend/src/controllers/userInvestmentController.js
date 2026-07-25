const userInvestmentModel = require('../models/userInvestmentModel');
const investmentModel = require('../models/investmentModel');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');
const { success, failure } = require('../utils/apiResponse');

async function selectPlan(req, res, next) {
  try {
    const { investmentId, amount } = req.body;

    const plan = await investmentModel.findById(investmentId);
    if (!plan) {
      return failure(res, 404, 'Investment plan not found.');
    }

    if (plan.minimumAmount && Number(amount) < Number(plan.minimumAmount)) {
      return failure(
        res,
        400,
        `The minimum amount for ${plan.name} is $${Number(plan.minimumAmount).toFixed(2)}.`
      );
    }

    const selection = await userInvestmentModel.create({
      userId: req.user.id,
      investmentId,
      investedAmount: amount
    });

    emailService
      .notifyAdminOfPlanSelection(req.user, { ...selection, planName: plan.name })
      .catch((error) =>
        logger.error(`Failed to notify admin of plan selection: ${error.message}`)
      );

    return success(res, 201, 'Plan selection submitted and pending approval.', { selection });
  } catch (error) {
    return next(error);
  }
}

async function getMySelections(req, res, next) {
  try {
    const selections = await userInvestmentModel.findByUser(req.user.id);
    return success(res, 200, 'Your investment selections retrieved successfully.', { selections });
  } catch (error) {
    return next(error);
  }
}

module.exports = { selectPlan, getMySelections };
