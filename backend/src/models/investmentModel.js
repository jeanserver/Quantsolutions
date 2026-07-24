const { query } = require('../config/db');

const PUBLIC_COLUMNS = `
  id, name, category, description, minimum_amount AS "minimumAmount",
  performance_fee_percent AS "performanceFeePercent",
  created_at AS "createdAt"
`;

async function findAll(category) {
  if (category) {
    const result = await query(
      `SELECT ${PUBLIC_COLUMNS} FROM investments WHERE category ILIKE $1 ORDER BY minimum_amount ASC NULLS LAST`,
      [category]
    );
    return result.rows;
  }
  const result = await query(`SELECT ${PUBLIC_COLUMNS} FROM investments ORDER BY minimum_amount ASC NULLS LAST`);
  return result.rows;
}

async function findById(id) {
  const result = await query(`SELECT ${PUBLIC_COLUMNS} FROM investments WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function create({ name, category, description, minimumAmount, performanceFeePercent }) {
  const result = await query(
    `INSERT INTO investments (name, category, description, minimum_amount, performance_fee_percent)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${PUBLIC_COLUMNS}`,
    [name, category, description, minimumAmount ?? null, performanceFeePercent]
  );
  return result.rows[0];
}

async function update(id, { name, category, description, minimumAmount, performanceFeePercent }) {
  const result = await query(
    `UPDATE investments
     SET name = $1, category = $2, description = $3, minimum_amount = $4, performance_fee_percent = $5
     WHERE id = $6
     RETURNING ${PUBLIC_COLUMNS}`,
    [name, category, description, minimumAmount ?? null, performanceFeePercent, id]
  );
  return result.rows[0] || null;
}

async function remove(id) {
  const result = await query(`DELETE FROM investments WHERE id = $1 RETURNING id`, [id]);
  return result.rows[0] || null;
}

module.exports = { findAll, findById, create, update, remove };
