const userModel = require('../models/userModel');
const authService = require('../services/authService');
const { success, failure } = require('../utils/apiResponse');

async function getMe(req, res, next) {
  try {
    const user = await userModel.findPublicById(req.user.id);
    return success(res, 200, 'Profile retrieved successfully.', { user });
  } catch (error) {
    return next(error);
  }
}

async function updateMe(req, res, next) {
  try {
    const { firstName, lastName, email, phone, address } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      return failure(res, 422, 'First name, last name, email, and phone are required.');
    }

    if (email.toLowerCase() !== req.user.email.toLowerCase()) {
      const existing = await userModel.findByEmail(email);
      if (existing && existing.id !== req.user.id) {
        return failure(res, 409, 'This email is already in use by another account.');
      }
    }

    const updatedUser = await userModel.updateProfile(req.user.id, {
      firstName,
      lastName,
      email,
      phone,
      address
    });

    return success(res, 200, 'Profile updated successfully.', { user: updatedUser });
  } catch (error) {
    return next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, { currentPassword, newPassword });
    return success(res, 200, 'Password changed successfully.');
  } catch (error) {
    if (error.statusCode) {
      return failure(res, error.statusCode, error.message);
    }
    return next(error);
  }
}

module.exports = { getMe, updateMe, changePassword };
