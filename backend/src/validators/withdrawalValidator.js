const { body } = require('express-validator');

const withdrawalValidator = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Withdrawal amount must be a positive number.'),
  body('method')
    .trim()
    .isIn(['bank_transfer', 'bitcoin', 'ethereum', 'usdt'])
    .withMessage('Invalid withdrawal method.'),
  body('bankName')
    .if(body('method').equals('bank_transfer'))
    .trim()
    .notEmpty()
    .withMessage('Bank name is required.'),
  body('accountName')
    .if(body('method').equals('bank_transfer'))
    .trim()
    .notEmpty()
    .withMessage('Account holder name is required.'),
  body('accountNumber')
    .if(body('method').equals('bank_transfer'))
    .trim()
    .notEmpty()
    .withMessage('Account number is required.'),
  body('walletAddress').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
  body('notes').optional({ checkFalsy: true }).trim().isLength({ max: 1000 })
];

module.exports = { withdrawalValidator };
