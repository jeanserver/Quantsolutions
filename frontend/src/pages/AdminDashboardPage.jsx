import { useEffect, useState } from 'react';
import Card from '../components/common/Card.jsx';
import Loader from '../components/common/Loader.jsx';
import Alert from '../components/common/Alert.jsx';
import Button from '../components/common/Button.jsx';
import {
  getAllDepositsRequest,
  getAllWithdrawalsRequest,
  updateDepositStatusRequest,
  updateWithdrawalStatusRequest
} from '../api/adminApi.js';
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

function RequestTable({ rows, type, onUpdateStatus, updatingId }) {
  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        No {type} requests to review.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
            <th className="py-3 pr-4">Reference</th>
            <th className="py-3 pr-4">Client</th>
            <th className="py-3 pr-4">Amount</th>
            {type === 'deposit' && <th className="py-3 pr-4">Method</th>}
            {type === 'withdrawal' && <th className="py-3 pr-4">Bank Details</th>}
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Date</th>
            <th className="py-3 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 align-top">
              <td className="py-3 pr-4 font-mono text-xs text-gray-600">{row.reference}</td>
              <td className="py-3 pr-4">
                <p className="font-medium text-brand-black">
                  {row.clientFirstName} {row.clientLastName}
                </p>
                <p className="text-xs text-gray-500">{row.clientEmail}</p>
              </td>
              <td className="py-3 pr-4 font-medium text-brand-black">
                {formatCurrency(row.amount)}
              </td>
              {type === 'deposit' && (
                <td className="py-3 pr-4 capitalize text-gray-600">
                  {row.method?.replace('_', ' ')}
                </td>
              )}
              {type === 'withdrawal' && (
                <td className="py-3 pr-4 text-gray-600">
                  <p>{row.bankName}</p>
                  <p className="text-xs text-gray-400">
                    {row.accountName} — {row.accountNumber}
                  </p>
                </td>
              )}
              <td className="py-3 pr-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="py-3 pr-4 text-gray-500">{formatDate(row.createdAt)}</td>
              <td className="py-3 pr-4">
                {row.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onUpdateStatus(row.id, 'approved')}
                      disabled={updatingId === row.id}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onUpdateStatus(row.id, 'rejected')}
                      disabled={updatingId === row.id}
                      className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">No actions available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('deposits');
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [depositsRes, withdrawalsRes] = await Promise.allSettled([
        getAllDepositsRequest(),
        getAllWithdrawalsRequest()
      ]);

      if (depositsRes.status === 'fulfilled') {
        setDeposits(depositsRes.value.data.deposits || []);
      } else {
        setDeposits([]);
      }

      if (withdrawalsRes.status === 'fulfilled') {
        setWithdrawals(withdrawalsRes.value.data.withdrawals || []);
      } else {
        setWithdrawals([]);
      }

      if (depositsRes.status === 'rejected' && withdrawalsRes.status === 'rejected') {
        setError('Unable to load requests at this time. Please try again shortly.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateDeposit = async (id, status) => {
    setUpdatingId(id);
    setActionMessage(null);
    try {
      await updateDepositStatusRequest(id, status);
      setActionMessage({ type: 'success', text: `Deposit request ${status}.` });
      await loadData();
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Unable to update deposit status.'
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateWithdrawal = async (id, status) => {
    setUpdatingId(id);
    setActionMessage(null);
    try {
      await updateWithdrawalStatusRequest(id, status);
      setActionMessage({ type: 'success', text: `Withdrawal request ${status}.` });
      await loadData();
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Unable to update withdrawal status.'
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingDepositsCount = deposits.filter((d) => d.status === 'pending').length;
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'pending').length;

  return (
    <div className="container-page section">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-black">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and process client deposit and withdrawal requests.
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {actionMessage && (
        <div className="mb-6">
          <Alert variant={actionMessage.type} onClose={() => setActionMessage(null)}>
            {actionMessage.text}
          </Alert>
        </div>
      )}

      {loading ? (
        <Loader label="Loading requests..." />
      ) : (
        <Card>
          <div className="mb-6 flex flex-wrap gap-3 border-b border-gray-200 pb-4">
            <button
              onClick={() => setActiveTab('deposits')}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${
                activeTab === 'deposits'
                  ? 'bg-brand-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Deposit Requests
              {pendingDepositsCount > 0 && (
                <span className="ml-2 rounded-full bg-brand-yellow px-2 py-0.5 text-xs font-bold text-brand-black">
                  {pendingDepositsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${
                activeTab === 'withdrawals'
                  ? 'bg-brand-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Withdrawal Requests
              {pendingWithdrawalsCount > 0 && (
                <span className="ml-2 rounded-full bg-brand-yellow px-2 py-0.5 text-xs font-bold text-brand-black">
                  {pendingWithdrawalsCount}
                </span>
              )}
            </button>
            <Button variant="outline" onClick={loadData} className="ml-auto">
              Refresh
            </Button>
          </div>

          {activeTab === 'deposits' ? (
            <RequestTable
              rows={deposits}
              type="deposit"
              onUpdateStatus={handleUpdateDeposit}
              updatingId={updatingId}
            />
          ) : (
            <RequestTable
              rows={withdrawals}
              type="withdrawal"
              onUpdateStatus={handleUpdateWithdrawal}
              updatingId={updatingId}
            />
          )}
        </Card>
      )}
    </div>
  );
}

export default AdminDashboardPage;
