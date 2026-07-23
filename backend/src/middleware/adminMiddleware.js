const { failure } = require('../utils/apiResponse');

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return failure(res, 403, 'You do not have permission to access this resource.');
  }
  return next();
}

module.exports = adminMiddleware;
