import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card.jsx';
import Loader from '../components/common/Loader.jsx';
import Alert from '../components/common/Alert.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { getPortfolioSummaryRequest } from '../api/portfolioApi.js';
import { getTransactionsRequest } from '../api/transactionApi.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';

const statusStyles = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-900',
  rejected: 'bg-red-100 text-red-800'
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

function SummaryCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accent || 'text-brand-black'}`}>{value}</p>
    </div>
  );
}

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError('');
      try {
        const [summaryRes, transactionsRes] = await Promise.allSettled([
          getPortfolioSummaryRequest(),
          getTransactionsRequest()
        ]);

        if (!isMounted) return;

        if (summaryRes.status === 'fulfilled') {
          setSummary(summaryRes.value.data.summary || null);
        } else {
          setSummary(null);
        }

        if (transactionsRes.status === 'fulfilled') {
          setTransactions(transactionsRes.value.data.transactions || []);
        } else {
          setTransactions([]);
        }

        if (summaryRes.status === 'rejected' && transactionsRes.status === 'rejected') {
          setError('Unable to load your account data at this time. Please try again shortly.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="container-page section">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">
            Welcome{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here is a summary of your QuantSolutions account.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard/investments" className="btn btn-outline">
            Investment Plans
          </Link>
          <Link to="/dashboard/deposit" className="btn btn-primary">
            Deposit Request
          </Link>
          <Link to="/dashboard/withdrawal" className="btn btn-secondary">
            Withdrawal Request
          </Link>
          <Link to="/dashboard/profile" className="btn btn-outline">
            Profile
          </Link>
          <button onClick={handleLogout} className="btn btn-outline border-red-500 text-red-600 hover:bg-red-500 hover:text-white">
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {loading ? (
        <Loader label="Loading your account overview..." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              label="Portfolio Value"
              value={
                summary ? formatCurrency(summary.portfolioValue) : 'No data yet'
              }
            />
            <SummaryCard
              label="Available Balance"
              value={
                summary ? formatCurrency(summary.availableBalance) : 'No data yet'
              }
            />
            <SummaryCard
              label="Total Deposits"
              value={summary ? formatCurrency(summary.totalDeposits) : 'No data yet'}
              accent="text-green-700"
            />
            <SummaryCard
              label="Total Withdrawals"
              value={summary ? formatCurrency(summary.totalWithdrawals) : 'No data yet'}
              accent="text-red-700"
            />
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Values reflect approved deposits and withdrawals on your account. Portfolio
            value does not include projected or estimated returns.
          </p>

          <div className="mt-8">
            <Card title="Transaction History">
              {transactions.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  You have no transactions yet. Submit a deposit or withdrawal
                  request to see activity here.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                        <th className="py-3 pr-4">Reference</th>
                        <th className="py-3 pr-4">Type</th>
                        <th className="py-3 pr-4">Amount</th>
                        <th className="py-3 pr-4">Status</th>
                        <th className="py-3 pr-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-gray-100">
                          <td className="py-3 pr-4 font-mono text-xs text-gray-600">
                            {tx.reference}
                          </td>
                          <td className="py-3 pr-4 capitalize">{tx.type}</td>
                          <td className="py-3 pr-4 font-medium text-brand-black">
                            {formatCurrency(tx.amount)}
                          </td>
                          <td className="py-3 pr-4">
                            <StatusBadge status={tx.status} />
                          </td>
                          <td className="py-3 pr-4 text-gray-500">
                            {formatDate(tx.createdAt)}
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
    </div>
  );
}

export default DashboardPage;
