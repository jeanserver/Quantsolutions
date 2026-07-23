const { query } = require('../config/db');

const PUBLIC_COLUMNS = `
  id, first_name AS "firstName", last_name AS "lastName", email, phone,
  address, role, is_active AS "isActive", created_at AS "createdAt"
`;

async function create({ firstName, lastName, email, phone, passwordHash }) {
  const result = await query(
    `INSERT INTO users (first_name, last_name, email, phone, password_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${PUBLIC_COLUMNS}`,
    [firstName, lastName, email.toLowerCase(), phone, passwordHash]
  );
  return result.rows[0];
}

async function findByEmail(email) {
  const result = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  return result.rows[0] || null;
}

async function findById(id) {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function findPublicById(id) {
  const result = await query(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function updateProfile(id, { firstName, lastName, email, phone, address }) {
  const result = await query(
    `UPDATE users
     SET first_name = $1, last_name = $2, email = $3, phone = $4, address = $5, updated_at = NOW()
     WHERE id = $6
     RETURNING ${PUBLIC_COLUMNS}`,
    [firstName, lastName, email.toLowerCase(), phone, address || null, id]
  );
  return result.rows[0];
}

async function updatePassword(id, passwordHash) {
  await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
    passwordHash,
    id
  ]);
}

async function setActiveStatus(id, isActive) {
  const result = await query(
    `UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING ${PUBLIC_COLUMNS}`,
    [isActive, id]
  );
  return result.rows[0];
}

module.exports = {
  create,
  findByEmail,
  findById,
  findPublicById,
  updateProfile,
  updatePassword,
  setActiveStatus
};
