const { validationResult } = require('express-validator');
const { failure } = require('../utils/apiResponse');

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return failure(res, 422, firstError.msg);
  }
  return next();
}

module.exports = validateRequest;
