const investmentService = require('../services/investmentService');
const investmentModel = require('../models/investmentModel');
const { success, failure } = require('../utils/apiResponse');

async function listInvestments(req, res, next) {
  try {
    const { category } = req.query;
    const investments = await investmentService.listInvestments(category);
    return success(res, 200, 'Investment plans retrieved successfully.', { investments });
  } catch (error) {
    return next(error);
  }
}

async function createInvestment(req, res, next) {
  try {
    const investment = await investmentModel.create(req.body);
    return success(res, 201, 'Investment plan created successfully.', { investment });
  } catch (error) {
    return next(error);
  }
}

async function updateInvestment(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await investmentModel.findById(id);
    if (!existing) {
      return failure(res, 404, 'Investment plan not found.');
    }
    const investment = await investmentModel.update(id, req.body);
    return success(res, 200, 'Investment plan updated successfully.', { investment });
  } catch (error) {
    return next(error);
  }
}

async function deleteInvestment(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await investmentModel.findById(id);
    if (!existing) {
      return failure(res, 404, 'Investment plan not found.');
    }
    await investmentModel.remove(id);
    return success(res, 200, 'Investment plan deleted successfully.', {});
  } catch (error) {
    return next(error);
  }
}

module.exports = { listInvestments, createInvestment, updateInvestment, deleteInvestment };
