const transactionModel = require('../models/transactionModel');
const portfolioModel = require('../models/portfolioModel');

async function getSummary(user) {
  const totals = await transactionModel.getAccountSummaryByUser(user.id);
  const activeInvestments = await portfolioModel.countActiveInvestments(user.id);

  const totalDeposits = Number(totals.totalApprovedDeposits.toFixed(2));
  const totalWithdrawals = Number(totals.totalApprovedWithdrawals.toFixed(2));
  const availableBalance = Number((totalDeposits - totalWithdrawals).toFixed(2));

  // Portfolio value reflects capital currently under management — the sum of
  // approved deposits net of approved withdrawals. No performance, growth,
  // or return figures are applied or estimated.
  const portfolioValue = availableBalance > 0 ? availableBalance : 0;

  return {
    accountStatus: user.is_active ? 'Active' : 'Inactive',
    portfolioValue,
    availableBalance: availableBalance > 0 ? availableBalance : 0,
    totalDeposits,
    totalWithdrawals,
    activeInvestments
  };
}

module.exports = { getSummary };
