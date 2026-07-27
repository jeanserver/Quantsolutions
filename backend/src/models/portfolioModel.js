const { query } = require('../config/db');

async function countActiveInvestments(userId) {
  const result = await query(
    `SELECT COUNT(*)::int AS count FROM user_investments
     WHERE user_id = $1 AND status = 'active'`,
    [userId]
  );
  return result.rows[0].count;
}

async function getActiveInvestmentTotals(userId) {
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

async function getActiveInvestmentsWithPlan(userId) {
  const result = await query(
    `SELECT ui.id, ui.investment_id AS "investmentId", ui.invested_amount AS "investedAmount",
            ui.current_value AS "currentValue", ui.created_at AS "createdAt",
            i.name AS "planName", i.category AS "planCategory"
     FROM user_investments ui
     JOIN investments i ON i.id = ui.investment_id
     WHERE ui.user_id = $1 AND ui.status = 'active'
     ORDER BY ui.created_at ASC`,
    [userId]
  );
  return result.rows;
}

async function getPerformanceEntriesForInvestments(investmentIds) {
  if (!investmentIds.length) return [];
  const result = await query(
    `SELECT investment_id AS "investmentId", period_label AS "periodLabel",
            return_percent AS "returnPercent", created_at AS "createdAt"
     FROM plan_performance_entries
     WHERE investment_id = ANY($1::uuid[])
     ORDER BY created_at ASC`,
    [investmentIds]
  );
  return result.rows;
}

module.exports = {
  countActiveInvestments,
  getActiveInvestmentTotals,
  getActiveInvestmentsWithPlan,
  getPerformanceEntriesForInvestments
};
