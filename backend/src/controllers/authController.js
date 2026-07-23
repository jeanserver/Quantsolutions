const authService = require('../services/authService');
const { success, failure } = require('../utils/apiResponse');

async function register(req, res, next) {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    const { user, token } = await authService.registerUser({
      firstName,
      lastName,
      email,
      phone,
      password
    });

    return success(res, 201, 'Account created successfully.', {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    if (error.statusCode) {
      return failure(res, error.statusCode, error.message);
    }
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser({ email, password });

    return success(res, 200, 'Login successful.', { token, user });
  } catch (error) {
    if (error.statusCode) {
      return failure(res, error.statusCode, error.message);
    }
    return next(error);
  }
}

module.exports = { register, login };
