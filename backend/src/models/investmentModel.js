const { query } = require('../config/db');

const PUBLIC_COLUMNS = `
  id, name, category, description, minimum_amount AS "minimumAmount",
  created_at AS "createdAt"
`;

async function findAll(category) {
  if (category) {
    const result = await query(
      `SELECT ${PUBLIC_COLUMNS} FROM investments WHERE category ILIKE $1 ORDER BY name ASC`,
      [category]
    );
    return result.rows;
  }
  const result = await query(`SELECT ${PUBLIC_COLUMNS} FROM investments ORDER BY name ASC`);
  return result.rows;
}

async function findById(id) {
  const result = await query(`SELECT ${PUBLIC_COLUMNS} FROM investments WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

module.exports = { findAll, findById };
