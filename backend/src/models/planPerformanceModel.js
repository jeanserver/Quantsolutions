const { query, withTransaction } = require('../config/db');

const ENTRY_COLUMNS = `
  pe.id, pe.investment_id AS "investmentId", pe.period_label AS "periodLabel",
  pe.return_percent AS "returnPercent", pe.accounts_applied AS "accountsApplied",
  pe.notes, pe.created_at AS "createdAt",
  i.name AS "planName"
`;

// Applies a real, reported period return to every active client account in
// the given plan tier, and records the entry as an auditable history item.
// This never runs automatically — it only executes when an admin submits
// an actual reported result for that period.
async function applyPeriodReturn({ investmentId, periodLabel, returnPercent, notes }) {
  return withTransaction(async (client) => {
    const updateResult = await client.query(
      `UPDATE user_investments
       SET current_value = ROUND(current_value * (1 + $1::numeric / 100), 2),
           updated_at = NOW()
       WHERE investment_id = $2 AND status = 'active'
       RETURNING id`,
      [returnPercent, investmentId]
    );

    const accountsApplied = updateResult.rowCount;

    const entryResult = await client.query(
      `INSERT INTO plan_performance_entries
         (investment_id, period_label, return_percent, accounts_applied, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, investment_id AS "investmentId", period_label AS "periodLabel",
                 return_percent AS "returnPercent", accounts_applied AS "accountsApplied",
                 notes, created_at AS "createdAt"`,
      [investmentId, periodLabel, returnPercent, accountsApplied, notes || null]
    );

    return entryResult.rows[0];
  });
}

async function findAll() {
  const result = await query(
    `SELECT ${ENTRY_COLUMNS}
     FROM plan_performance_entries pe
     JOIN investments i ON i.id = pe.investment_id
     ORDER BY pe.created_at DESC`
  );
  return result.rows;
}

async function findByInvestment(investmentId) {
  const result = await query(
    `SELECT ${ENTRY_COLUMNS}
     FROM plan_performance_entries pe
     JOIN investments i ON i.id = pe.investment_id
     WHERE pe.investment_id = $1
     ORDER BY pe.created_at DESC`,
    [investmentId]
  );
  return result.rows;
}

module.exports = { applyPeriodReturn, findAll, findByInvestment };
