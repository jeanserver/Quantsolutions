const { query } = require('../config/db');

async function countActiveInvestments(userId) {
  const result = await query(
    `SELECT COUNT(*)::int AS count FROM user_investments
     WHERE user_id = $1 AND status = 'active'`,
    [userId]
  );
  return result.rows[0].count;
}

module.exports = { countActiveInvestments };
