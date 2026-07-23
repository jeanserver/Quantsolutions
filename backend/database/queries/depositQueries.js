const { query } = require('../../src/config/db');

const PUBLIC_COLUMNS = `
  id, user_id AS "userId", amount, method, status, reference, notes,
  created_at AS "createdAt", updated_at AS "updatedAt"
`;

async function createDeposit({ userId, amount, method, notes, reference }) {
  const result = await query(
    `INSERT INTO deposits (user_id, amount, method, notes, reference)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${PUBLIC_COLUMNS}`,
    [userId, amount, method, notes || null, reference]
  );
  return result.rows[0];
}

async function findDepositsByUser(userId, limit = 50) {
  const result = await query(
    `SELECT ${PUBLIC_COLUMNS} FROM deposits
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

async function findDepositById(id) {
  const result = await query(`SELECT ${PUBLIC_COLUMNS} FROM deposits WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function findAllDeposits(limit = 100) {
  const result = await query(
    `SELECT ${PUBLIC_COLUMNS} FROM deposits ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

async function updateDepositStatus(id, status) {
  const result = await query(
    `UPDATE deposits SET status = $1 WHERE id = $2 RETURNING ${PUBLIC_COLUMNS}`,
    [status, id]
  );
  return result.rows[0];
}

async function getApprovedDepositTotalByUser(userId) {
  const result = await query(
    `SELECT COALESCE(SUM(amount), 0)::float AS total
     FROM deposits
     WHERE user_id = $1 AND status = 'approved'`,
    [userId]
  );
  return result.rows[0].total;
}

module.exports = {
  createDeposit,
  findDepositsByUser,
  findDepositById,
  findAllDeposits,
  updateDepositStatus,
  getApprovedDepositTotalByUser
};
