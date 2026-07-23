const { body } = require('express-validator');

const withdrawalValidator = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Withdrawal amount must be a positive number.'),
  body('bankName').trim().notEmpty().withMessage('Bank name is required.'),
  body('accountName').trim().notEmpty().withMessage('Account holder name is required.'),
  body('accountNumber').trim().notEmpty().withMessage('Account number is required.'),
  body('notes').optional({ checkFalsy: true }).trim().isLength({ max: 1000 })
];

module.exports = { withdrawalValidator };
