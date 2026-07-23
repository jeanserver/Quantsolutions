const { query } = require('../../src/config/db');

const PUBLIC_COLUMNS = `
  id, user_id AS "userId", amount, bank_name AS "bankName",
  account_name AS "accountName", account_number AS "accountNumber",
  status, reference, notes, created_at AS "createdAt", updated_at AS "updatedAt"
`;

async function createWithdrawal({
  userId,
  amount,
  bankName,
  accountName,
  accountNumber,
  notes,
  reference
}) {
  const result = await query(
    `INSERT INTO withdrawals (user_id, amount, bank_name, account_name, account_number, notes, reference)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${PUBLIC_COLUMNS}`,
    [userId, amount, bankName, accountName, accountNumber, notes || null, reference]
  );
  return result.rows[0];
}

async function findWithdrawalsByUser(userId, limit = 50) {
  const result = await query(
    `SELECT ${PUBLIC_COLUMNS} FROM withdrawals
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

async function findWithdrawalById(id) {
  const result = await query(`SELECT ${PUBLIC_COLUMNS} FROM withdrawals WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function findAllWithdrawals(limit = 100) {
  const result = await query(
    `SELECT ${PUBLIC_COLUMNS} FROM withdrawals ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

async function updateWithdrawalStatus(id, status) {
  const result = await query(
    `UPDATE withdrawals SET status = $1 WHERE id = $2 RETURNING ${PUBLIC_COLUMNS}`,
    [status, id]
  );
  return result.rows[0];
}

async function getApprovedWithdrawalTotalByUser(userId) {
  const result = await query(
    `SELECT COALESCE(SUM(amount), 0)::float AS total
     FROM withdrawals
     WHERE user_id = $1 AND status = 'approved'`,
    [userId]
  );
  return result.rows[0].total;
}

module.exports = {
  createWithdrawal,
  findWithdrawalsByUser,
  findWithdrawalById,
  findAllWithdrawals,
  updateWithdrawalStatus,
  getApprovedWithdrawalTotalByUser
};
