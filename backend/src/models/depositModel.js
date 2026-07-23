const { query } = require('../config/db');

const PUBLIC_COLUMNS = `
  id, user_id AS "userId", amount, method, status, reference, notes,
  created_at AS "createdAt", updated_at AS "updatedAt"
`;

async function create({ userId, amount, method, notes, reference }) {
  const result = await query(
    `INSERT INTO deposits (user_id, amount, method, notes, reference)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${PUBLIC_COLUMNS}`,
    [userId, amount, method, notes || null, reference]
  );
  return result.rows[0];
}

async function findByUser(userId, limit = 50) {
  const result = await query(
    `SELECT ${PUBLIC_COLUMNS} FROM deposits
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

async function findById(id) {
  const result = await query(`SELECT ${PUBLIC_COLUMNS} FROM deposits WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function findAll(limit = 100) {
  const result = await query(
    `SELECT
       d.id, d.user_id AS "userId", d.amount, d.method, d.status, d.reference, d.notes,
       d.created_at AS "createdAt", d.updated_at AS "updatedAt",
       u.first_name AS "clientFirstName", u.last_name AS "clientLastName", u.email AS "clientEmail"
     FROM deposits d
     JOIN users u ON u.id = d.user_id
     ORDER BY d.created_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

async function updateStatus(id, status) {
  const result = await query(
    `UPDATE deposits SET status = $1 WHERE id = $2 RETURNING ${PUBLIC_COLUMNS}`,
    [status, id]
  );
  return result.rows[0];
}

async function getApprovedTotalByUser(userId) {
  const result = await query(
    `SELECT COALESCE(SUM(amount), 0)::float AS total
     FROM deposits
     WHERE user_id = $1 AND status = 'approved'`,
    [userId]
  );
  return result.rows[0].total;
}

module.exports = { create, findByUser, findById, findAll, updateStatus, getApprovedTotalByUser };
