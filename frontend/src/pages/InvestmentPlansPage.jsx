import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import Card from '../components/common/Card.jsx';
import Loader from '../components/common/Loader.jsx';
import Alert from '../components/common/Alert.jsx';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import { getInvestmentsRequest } from '../api/investmentApi.js';
import { selectPlanRequest, getMySelectionsRequest } from '../api/userInvestmentApi.js';
import { formatCurrency } from '../utils/formatCurrency.js';

const statusStyles = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-900',
  rejected: 'bg-red-100 text-red-800',
  closed: 'bg-gray-100 text-gray-700'
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        statusStyles[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  );
}

function PlanCard({ plan, onChoose }) {
  const [amount, setAmount] = useState(plan.minimumAmount ? String(plan.minimumAmount) : '');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isInstitutional = !plan.minimumAmount;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    if (plan.minimumAmount && numericAmount < Number(plan.minimumAmount)) {
      setError(`Minimum for ${plan.name} is ${formatCurrency(plan.minimumAmount)}.`);
      return;
    }

    setSubmitting(true);
    try {
      await onChoose(plan.id, numericAmount);
      setOpen(false);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to submit your selection right now.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-card">
      <h3 className="text-lg font-bold text-brand-black">{plan.name}</h3>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-400">
        {plan.category}
      </p>
      <p className="mt-3 flex-1 text-sm text-gray-600">{plan.description}</p>

      <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Minimum investment</span>
          <span className="font-semibold text-brand-black">
            {plan.minimumAmount ? formatCurrency(plan.minimumAmount) : "Let's discuss"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Performance fee</span>
          <span className="font-semibold text-brand-black">
            {Number(plan.performanceFeePercent).toFixed(2)}%
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Performance fee applies only to profits generated, not to your total invested capital.
      </p>

      <div className="mt-5">
        {isInstitutional ? (
          <a href="/contact" className="btn btn-outline block w-full text-center">
            Contact Us
          </a>
        ) : open ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && <Alert variant="error">{error}</Alert>}
            <Input
              label="Amount to invest (USD)"
              name={`amount-${plan.id}`}
              type="number"
              min={plan.minimumAmount || 1}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" loading={submitting} fullWidth>
                Confirm Selection
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button type="button" fullWidth onClick={() => setOpen(true)}>
            Choose This Plan
          </Button>
        )}
      </div>
    </div>
  );
}

function InvestmentPlansPage() {
  const [plans, setPlans] = useState([]);
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [plansRes, selectionsRes] = await Promise.allSettled([
        getInvestmentsRequest(),
        getMySelectionsRequest()
      ]);

      if (plansRes.status === 'fulfilled') {
        setPlans(plansRes.value.data.investments || []);
      }
      if (selectionsRes.status === 'fulfilled') {
        setSelections(selectionsRes.value.data.selections || []);
      }
      if (plansRes.status === 'rejected') {
        setError(
          plansRes.reason.response?.data?.message ||
            'Unable to load investment plans right now. Please try again shortly.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChoose = async (investmentId, amount) => {
    const { data } = await selectPlanRequest({ investmentId, amount });
    setConfirmation(
      `Your selection has been submitted and is pending approval. Reference: ${data.selection?.id || ''}`
    );
    await loadData();
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-black">Investment Plans</h1>
        <p className="mt-1 text-sm text-gray-500">
          Choose the tier that fits your capital and goals. Selections are reviewed by our
          team before your capital is allocated.
        </p>
      </div>

      {confirmation && (
        <div className="mb-6">
          <Alert variant="success" onClose={() => setConfirmation('')}>
            {confirmation}
          </Alert>
        </div>
      )}

      {error && (
        <div className="mb-6">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {loading ? (
        <Loader label="Loading investment plans..." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onChoose={handleChoose} />
            ))}
          </div>

          <div className="mt-10">
            <Card title="My Selections">
              {selections.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">
                  You haven't selected a plan yet. Choose one above to get started.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                        <th className="py-3 pr-4">Plan</th>
                        <th className="py-3 pr-4">Invested</th>
                        <th className="py-3 pr-4">Current Value</th>
                        <th className="py-3 pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selections.map((s) => (
                        <tr key={s.id} className="border-b border-gray-100">
                          <td className="py-3 pr-4 font-medium text-brand-black">{s.planName}</td>
                          <td className="py-3 pr-4">{formatCurrency(s.investedAmount)}</td>
                          <td className="py-3 pr-4">
                            {s.status === 'active' ? formatCurrency(s.currentValue) : '—'}
                          </td>
                          <td className="py-3 pr-4">
                            <StatusBadge status={s.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default InvestmentPlansPage;
