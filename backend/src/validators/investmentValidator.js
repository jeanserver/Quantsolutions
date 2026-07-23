const { query } = require('express-validator');

const listInvestmentsValidator = [
  query('category').optional().trim().isLength({ max: 100 })
];

module.exports = { listInvestmentsValidator };
