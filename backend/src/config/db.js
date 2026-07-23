const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { env } = require('./env');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseSsl ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('error', (err) => {
  logger.error(`Unexpected PostgreSQL pool error: ${err.message}`);
});

async function query(text, params) {
  return pool.query(text, params);
}

/**
 * Runs a callback inside a single client transaction (BEGIN/COMMIT/ROLLBACK).
 */
async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Applies database/schema.sql directly. Safe to run repeatedly — every
 * statement in schema.sql is idempotent (IF NOT EXISTS / CREATE OR REPLACE / DROP ... IF EXISTS).
 */
async function initDb() {
  const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await query(schemaSql);
}

module.exports = { pool, query, withTransaction, initDb };
