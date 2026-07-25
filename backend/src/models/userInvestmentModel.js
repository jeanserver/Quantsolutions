const { query } = require('../config/db');

const CLIENT_COLUMNS = `
  ui.id, ui.investment_id AS "investmentId", ui.invested_amount AS "investedAmount",
  ui.current_value AS "currentValue", ui.status, ui.notes,
  ui.created_at AS "createdAt", ui.updated_at AS "updatedAt",
  i.name AS "planName", i.category AS "planCategory"
`;

const ADMIN_COLUMNS = `
  ${CLIENT_COLUMNS},
  u.first_name AS "clientFirstName", u.last_name AS "clientLastName", u.email AS "clientEmail"
`;

async function create({ userId, investmentId, investedAmount }) {
  const result = await query(
    `INSERT INTO user_investments (user_id, investment_id, invested_amount, current_value, status)
     VALUES ($1, $2, $3, $3, 'pending')
     RETURNING id, investment_id AS "investmentId", invested_amount AS "investedAmount",
               current_value AS "currentValue", status, created_at AS "createdAt"`,
    [userId, investmentId, investedAmount]
  );
  return result.rows[0];
}

async function findByUser(userId) {
  const result = await query(
    `SELECT ${CLIENT_COLUMNS}
     FROM user_investments ui
     JOIN investments i ON i.id = ui.investment_id
     WHERE ui.user_id = $1
     ORDER BY ui.created_at DESC`,
    [userId]
  );
  return result.rows;
}

async function findById(id) {
  const result = await query(
    `SELECT ui.*, i.name AS plan_name FROM user_investments ui
     JOIN investments i ON i.id = ui.investment_id
     WHERE ui.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function findAll() {
  const result = await query(
    `SELECT ${ADMIN_COLUMNS}
     FROM user_investments ui
     JOIN investments i ON i.id = ui.investment_id
     JOIN users u ON u.id = ui.user_id
     ORDER BY ui.created_at DESC`
  );
  return result.rows;
}

async function updateStatus(id, status) {
  const result = await query(
    `UPDATE user_investments SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, status`,
    [status, id]
  );
  return result.rows[0] || null;
}

async function updateValue(id, currentValue, notes) {
  const result = await query(
    `UPDATE user_investments
     SET current_value = $1, notes = COALESCE($2, notes), updated_at = NOW()
     WHERE id = $3
     RETURNING id, current_value AS "currentValue", notes, updated_at AS "updatedAt"`,
    [currentValue, notes || null, id]
  );
  return result.rows[0] || null;
}

async function getActiveTotalsByUser(userId) {
  const result = await query(
    `SELECT
       COALESCE(SUM(invested_amount), 0)::float AS "investedTotal",
       COALESCE(SUM(current_value), 0)::float AS "currentTotal"
     FROM user_investments
     WHERE user_id = $1 AND status = 'active'`,
    [userId]
  );
  return result.rows[0];
}

module.exports = {
  create,
  findByUser,
  findById,
  findAll,
  updateStatus,
  updateValue,
  getActiveTotalsByUser
};
