const investmentModel = require('../models/investmentModel');

async function listInvestments(category) {
  return investmentModel.findAll(category);
}

module.exports = { listInvestments };
