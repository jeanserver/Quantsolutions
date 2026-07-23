const { verifyToken } = require('../utils/generateToken');
const { failure } = require('../utils/apiResponse');
const userModel = require('../models/userModel');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return failure(res, 401, 'Authentication required. Please log in.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return failure(res, 401, 'User account no longer exists.');
    }

    if (!user.is_active) {
      return failure(res, 403, 'This account has been deactivated.');
    }

    req.user = user;
    return next();
  } catch (error) {
    return failure(res, 401, 'Invalid or expired session. Please log in again.');
  }
}

module.exports = authMiddleware;
