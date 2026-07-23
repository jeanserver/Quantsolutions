const { body } = require('express-validator');

const depositValidator = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Deposit amount must be a positive number.'),
  body('method')
    .trim()
    .isIn(['bank_transfer', 'wire_transfer', 'check'])
    .withMessage('Invalid deposit method.'),
  body('notes').optional({ checkFalsy: true }).trim().isLength({ max: 1000 })
];

module.exports = { depositValidator };
