require('dotenv').config();

const app = require('./src/app');
const { env } = require('./src/config/env');
const { initDb, pool } = require('./src/config/db');
const { verifyTransporter } = require('./src/config/mailer');
const logger = require('./src/utils/logger');

async function start() {
  try {
    await initDb();
    logger.info('Database initialized successfully.');
  } catch (error) {
    logger.error(`Database initialization failed: ${error.message}`);
  }

  await verifyTransporter();

  const server = app.listen(env.port, () => {
    logger.info(`QuantSolutions API running on port ${env.port} [${env.nodeEnv}]`);
  });

  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      try {
        await pool.end();
        logger.info('Database pool closed.');
      } catch (error) {
        logger.error(`Error closing database pool: ${error.message}`);
      } finally {
        process.exit(0);
      }
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start();
