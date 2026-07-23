const { query } = require('../config/db');

const PUBLIC_COLUMNS = `
  id, user_id AS "userId", type, source_id AS "sourceId", amount, status,
  reference, created_at AS "createdAt", updated_at AS "updatedAt"
`;

// Rows in "transactions" are written automatically by database triggers
// when deposits/withdrawals are inserted or have their status updated.
// This module only reads the ledger — it never writes to it directly.

async function findByUser(userId, limit = 50) {
  const result = await query(
    `SELECT ${PUBLIC_COLUMNS} FROM transactions
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

async function findAll(limit = 100) {
  const result = await query(
    `SELECT ${PUBLIC_COLUMNS} FROM transactions ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

async function getAccountSummaryByUser(userId) {
  const result = await query(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'deposit' AND status = 'approved' THEN amount ELSE 0 END), 0)::float AS "totalApprovedDeposits",
       COALESCE(SUM(CASE WHEN type = 'withdrawal' AND status = 'approved' THEN amount ELSE 0 END), 0)::float AS "totalApprovedWithdrawals"
     FROM transactions
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
}

module.exports = { findByUser, findAll, getAccountSummaryByUser };
