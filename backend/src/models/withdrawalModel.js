const { query } = require('../config/db');

const PUBLIC_COLUMNS = `
  id, user_id AS "userId", amount, method,
  bank_name AS "bankName", account_name AS "accountName", account_number AS "accountNumber",
  wallet_address AS "walletAddress",
  status, reference, notes, created_at AS "createdAt", updated_at AS "updatedAt"
`;

async function create({ userId, amount, method, bankName, accountName, accountNumber, walletAddress, notes, reference }) {
  const result = await query(
    `INSERT INTO withdrawals (user_id, amount, method, bank_name, account_name, account_number, wallet_address, notes, reference)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${PUBLIC_COLUMNS}`,
    [userId, amount, method, bankName || null, accountName || null, accountNumber || null, walletAddress || null, notes || null, reference]
  );
  return result.rows[0];
}

async function findByUser(userId, limit = 50) {
  const result = await query(
    `SELECT ${PUBLIC_COLUMNS} FROM withdrawals
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

async function findById(id) {
  const result = await query(`SELECT ${PUBLIC_COLUMNS} FROM withdrawals WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function findAll(limit = 100) {
  const result = await query(
    `SELECT
       w.id, w.user_id AS "userId", w.amount, w.method,
       w.bank_name AS "bankName", w.account_name AS "accountName", w.account_number AS "accountNumber",
       w.wallet_address AS "walletAddress",
       w.status, w.reference, w.notes, w.created_at AS "createdAt", w.updated_at AS "updatedAt",
       u.first_name AS "clientFirstName", u.last_name AS "clientLastName", u.email AS "clientEmail"
     FROM withdrawals w
     JOIN users u ON u.id = w.user_id
     ORDER BY w.created_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

async function updateStatus(id, status) {
  const result = await query(
    `UPDATE withdrawals SET status = $1 WHERE id = $2 RETURNING ${PUBLIC_COLUMNS}`,
    [status, id]
  );
  return result.rows[0];
}

async function getApprovedTotalByUser(userId) {
  const result = await query(
    `SELECT COALESCE(SUM(amount), 0)::float AS total
     FROM withdrawals
     WHERE user_id = $1 AND status = 'approved'`,
    [userId]
  );
  return result.rows[0].total;
}

module.exports = { create, findByUser, findById, findAll, updateStatus, getApprovedTotalByUser };
