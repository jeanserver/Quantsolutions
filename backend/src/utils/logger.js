function timestamp() {
  return new Date().toISOString();
}

const logger = {
  info(message) {
    // eslint-disable-next-line no-console
    console.log(`[${timestamp()}] INFO: ${message}`);
  },
  warn(message) {
    // eslint-disable-next-line no-console
    console.warn(`[${timestamp()}] WARN: ${message}`);
  },
  error(message) {
    // eslint-disable-next-line no-console
    console.error(`[${timestamp()}] ERROR: ${message}`);
  }
};

module.exports = logger;
