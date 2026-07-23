const userModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/generateToken');
const emailService = require('./emailService');

class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function registerUser({ firstName, lastName, email, phone, password }) {
  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new AuthError('An account with this email already exists.', 409);
  }

  const passwordHash = await hashPassword(password);
  const user = await userModel.create({ firstName, lastName, email, phone, passwordHash });

  const token = generateToken({ id: user.id, role: user.role });

  emailService.sendWelcomeEmail(user).catch(() => {});

  return { user, token };
}

async function loginUser({ email, password }) {
  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new AuthError('Invalid email or password.', 401);
  }

  if (!user.is_active) {
    throw new AuthError('This account has been deactivated. Please contact support.', 403);
  }

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new AuthError('Invalid email or password.', 401);
  }

  const token = generateToken({ id: user.id, role: user.role });
  const publicUser = await userModel.findPublicById(user.id);

  return { user: publicUser, token };
}

async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new AuthError('User not found.', 404);
  }

  const isMatch = await comparePassword(currentPassword, user.password_hash);
  if (!isMatch) {
    throw new AuthError('Current password is incorrect.', 401);
  }

  const newHash = await hashPassword(newPassword);
  await userModel.updatePassword(userId, newHash);

  emailService.sendPasswordChangedEmail(user).catch(() => {});
}

module.exports = { registerUser, loginUser, changePassword, AuthError };
