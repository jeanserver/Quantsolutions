const logger = require('../utils/logger');
const { env } = require('../config/env');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error(err.stack || err.message);

  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const message =
    statusCode === 500 && env.nodeEnv === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'An unexpected error occurred.';

  res.status(statusCode).json({
    success: false,
    message
  });
}

module.exports = errorHandler;
