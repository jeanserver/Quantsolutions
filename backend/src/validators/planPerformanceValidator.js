const { body } = require('express-validator');

const applyPeriodReturnValidator = [
  body('investmentId').isUUID().withMessage('A valid plan must be selected.'),
  body('periodLabel')
    .trim()
    .notEmpty()
    .withMessage('A period label is required (e.g. "July 2026").')
    .isLength({ max: 50 }),
  body('returnPercent')
    .isFloat({ min: -100, max: 100 })
    .withMessage('Return percent must be a realistic number between -100 and 100.'),
  body('notes').optional({ checkFalsy: true }).trim().isLength({ max: 1000 })
];

module.exports = { applyPeriodReturnValidator };
