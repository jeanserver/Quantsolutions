const transactionModel = require('../models/transactionModel');
const portfolioModel = require('../models/portfolioModel');

async function getSummary(user) {
  const totals = await transactionModel.getAccountSummaryByUser(user.id);
  const activeInvestments = await portfolioModel.countActiveInvestments(user.id);
  const investmentTotals = await portfolioModel.getActiveInvestmentTotals(user.id);

  const totalDeposits = Number(totals.totalApprovedDeposits.toFixed(2));
  const totalWithdrawals = Number(totals.totalApprovedWithdrawals.toFixed(2));
  const netCash = totalDeposits - totalWithdrawals;

  const investedTotal = Number(investmentTotals.investedTotal.toFixed(2));
  const currentInvestmentValue = Number(investmentTotals.currentTotal.toFixed(2));

  const availableBalance = Math.max(netCash - investedTotal, 0);
  const portfolioValue = Number((availableBalance + currentInvestmentValue).toFixed(2));

  return {
    accountStatus: user.is_active ? 'Active' : 'Inactive',
    portfolioValue,
    availableBalance,
    totalDeposits,
    totalWithdrawals,
    investedTotal,
    currentInvestmentValue,
    activeInvestments
  };
}

// Builds a real value-over-time series per active investment from its
// invested amount plus every plan performance entry actually applied to it,
// then merges all of a client's investments into one combined series.
// Nothing here is simulated — every point traces back to a real reported
// period return from the Plan Performance admin tool.
async function getOverview(user) {
  const investments = await portfolioModel.getActiveInvestmentsWithPlan(user.id);

  if (investments.length === 0) {
    return {
      totalInvested: 0,
      currentValue: 0,
      roiPercent: 0,
      activePlans: 0,
      growthSeries: [],
      allocation: []
    };
  }

  const investmentIds = investments.map((inv) => inv.investmentId);
  const entries = await portfolioModel.getPerformanceEntriesForInvestments(investmentIds);

  const entriesByInvestment = new Map();
  entries.forEach((entry) => {
    if (!entriesByInvestment.has(entry.investmentId)) {
      entriesByInvestment.set(entry.investmentId, []);
    }
    entriesByInvestment.get(entry.investmentId).push(entry);
  });

  // Build a { date, value } trajectory per investment.
  const trajectories = investments.map((inv) => {
    const points = [{ date: new Date(inv.createdAt), value: Number(inv.investedAmount) }];
    let runningValue = Number(inv.investedAmount);
    const invEntries = entriesByInvestment.get(inv.investmentId) || [];
    invEntries.forEach((entry) => {
      runningValue = Number((runningValue * (1 + Number(entry.returnPercent) / 100)).toFixed(2));
      points.push({ date: new Date(entry.createdAt), value: runningValue });
    });
    return { startDate: new Date(inv.createdAt), points };
  });

  // Merge trajectories into one combined series across all distinct dates.
  const allDates = new Set();
  trajectories.forEach((t) => t.points.forEach((p) => allDates.add(p.date.getTime())));
  const sortedDates = Array.from(allDates).sort((a, b) => a - b);

  const growthSeries = sortedDates.map((time) => {
    const date = new Date(time);
    let total = 0;
    trajectories.forEach((t) => {
      if (date < t.startDate) return;
      let valueAtDate = t.points[0].value;
      for (const p of t.points) {
        if (p.date.getTime() <= time) valueAtDate = p.value;
        else break;
      }
      total += valueAtDate;
    });
    return { date: date.toISOString().slice(0, 10), value: Number(total.toFixed(2)) };
  });

  const totalInvested = Number(
    investments.reduce((sum, inv) => sum + Number(inv.investedAmount), 0).toFixed(2)
  );
  const currentValue = Number(
    investments.reduce((sum, inv) => sum + Number(inv.currentValue), 0).toFixed(2)
  );
  const roiPercent = totalInvested > 0
    ? Number((((currentValue - totalInvested) / totalInvested) * 100).toFixed(2))
    : 0;

  const allocationMap = new Map();
  investments.forEach((inv) => {
    const label = inv.planName;
    allocationMap.set(label, (allocationMap.get(label) || 0) + Number(inv.currentValue));
  });
  const allocation = Array.from(allocationMap.entries()).map(([label, value]) => ({
    label,
    value: Number(value.toFixed(2))
  }));

  return {
    totalInvested,
    currentValue,
    roiPercent,
    activePlans: investments.length,
    growthSeries,
    allocation
  };
}

module.exports = { getSummary, getOverview };
