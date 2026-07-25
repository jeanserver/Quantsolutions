import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import Card from '../components/common/Card.jsx';
import Loader from '../components/common/Loader.jsx';
import Alert from '../components/common/Alert.jsx';
import { getInvestmentsRequest } from '../api/investmentApi.js';
import { formatCurrency } from '../utils/formatCurrency.js';

function PlanCard({ plan }) {
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
    </div>
  );
}

function InvestmentPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadPlans() {
      setLoading(true);
      setError('');
      try {
        const { data } = await getInvestmentsRequest();
        if (isMounted) setPlans(data.investments || []);
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              'Unable to load investment plans right now. Please try again shortly.'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPlans();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-black">Investment Plans</h1>
        <p className="mt-1 text-sm text-gray-500">
          Choose the tier that fits your capital and goals. Performance fees apply only to
          gains generated, never to your invested capital.
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {loading ? (
        <Loader label="Loading investment plans..." />
      ) : plans.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm text-gray-500">
            No investment plans are available right now. Please check back shortly.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}

      <p className="mt-8 text-xs text-gray-400">
        Interested in a plan? Reach out via your Deposit Request or contact our team directly —
        our operations team will guide you through allocation into your selected tier.
      </p>
    </DashboardLayout>
  );
}

export default InvestmentPlansPage;
