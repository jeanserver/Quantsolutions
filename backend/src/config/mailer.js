const nodemailer = require('nodemailer');
const { env } = require('./env');
const logger = require('../utils/logger');

let transporter = null;
let verified = false;

function getTransporter() {
  if (transporter) return transporter;

  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    logger.warn('SMTP credentials are not fully configured. Emails will not be sent.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

  return transporter;
}

async function verifyTransporter() {
  if (verified) return true;
  const t = getTransporter();
  if (!t) return false;

  try {
    await t.verify();
    verified = true;
    logger.info('SMTP transporter verified successfully.');
    return true;
  } catch (error) {
    logger.error(`SMTP transporter verification failed: ${error.message}`);
    return false;
  }
}

module.exports = { getTransporter, verifyTransporter };
