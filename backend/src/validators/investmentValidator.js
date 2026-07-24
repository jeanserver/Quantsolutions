const { query, body } = require('express-validator');

const listInvestmentsValidator = [
  query('category').optional().trim().isLength({ max: 100 })
];

const investmentWriteValidator = [
  body('name').trim().notEmpty().withMessage('Plan name is required.').isLength({ max: 150 }),
  body('category').trim().notEmpty().withMessage('Category is required.').isLength({ max: 100 }),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('minimumAmount')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ gt: 0 })
    .withMessage('Minimum amount must be a positive number, or omitted for custom/negotiated plans.'),
  body('performanceFeePercent')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Performance fee must be a percentage between 0 and 100.')
];

module.exports = { listInvestmentsValidator, investmentWriteValidator };
