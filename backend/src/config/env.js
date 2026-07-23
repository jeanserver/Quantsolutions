require('dotenv').config();

const requiredVars = ['JWT_SECRET', 'DATABASE_URL'];

const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.warn(
    `Warning: missing environment variables: ${missing.join(', ')}. ` +
      'The server will start but related features may fail until these are set.'
  );
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,

  databaseUrl: process.env.DATABASE_URL || '',
  databaseSsl: process.env.DATABASE_SSL === 'true',

  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: parseInt(process.env.SMTP_PORT, 10) || 587,
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || 'QuantSolutions <no-reply@quantsolutions.com>',

  adminEmail: process.env.ADMIN_EMAIL || '',

  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};

if (!env.adminEmail) {
  // eslint-disable-next-line no-console
  console.warn(
    'Warning: ADMIN_EMAIL is not set. Deposit/withdrawal notifications will not be sent.'
  );
}

module.exports = { env };
