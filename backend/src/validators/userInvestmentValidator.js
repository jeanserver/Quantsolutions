const { body } = require('express-validator');

const selectPlanValidator = [
  body('investmentId').isUUID().withMessage('A valid investment plan must be selected.'),
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Enter a valid amount to invest.')
];

const updateValueValidator = [
  body('currentValue')
    .isFloat({ min: 0 })
    .withMessage('Current value must be zero or greater.'),
  body('notes').optional({ checkFalsy: true }).trim().isLength({ max: 1000 })
];

module.exports = { selectPlanValidator, updateValueValidator };
