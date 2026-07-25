import { useEffect, useState } from 'react';
import Card from '../components/common/Card.jsx';
import Loader from '../components/common/Loader.jsx';
import Alert from '../components/common/Alert.jsx';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import {
  getAllDepositsRequest,
  getAllWithdrawalsRequest,
  updateDepositStatusRequest,
  updateWithdrawalStatusRequest,
  getAllPlanSelectionsRequest,
  approvePlanSelectionRequest,
  rejectPlanSelectionRequest,
  updatePlanSelectionValueRequest,
  getAllPlanPerformanceRequest,
  applyPlanPerformanceRequest
} from '../api/adminApi.js';
import { getInvestmentsRequest } from '../api/investmentApi.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';

const statusStyles = {
  approved: 'bg-green-100 text-green-800',
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
            {type === 'withdrawal' && <th className="py-3 pr-4">Payout Details</th>}
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
                  {row.method === 'bank_transfer' ? (
                    <>
                      <p>{row.bankName}</p>
                      <p className="text-xs text-gray-400">
                        {row.accountName} — {row.accountNumber}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="capitalize">{row.method}</p>
                      <p className="text-xs text-gray-400">
                        {row.walletAddress || 'No address provided — contact client by email'}
                      </p>
                    </>
                  )}
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

function PlanSelectionsTab() {
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [valueInput, setValueInput] = useState('');
  const [notesInput, setNotesInput] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getAllPlanSelectionsRequest();
      setSelections(data.selections || []);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Unable to load plan selections.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id) => {
    setBusyId(id);
    try {
      await approvePlanSelectionRequest(id);
      setMessage({ type: 'success', text: 'Plan selection approved.' });
      await load();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Unable to approve.' });
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id) => {
    setBusyId(id);
    try {
      await rejectPlanSelectionRequest(id);
      setMessage({ type: 'success', text: 'Plan selection rejected.' });
      await load();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Unable to reject.' });
    } finally {
      setBusyId(null);
    }
  };

  const startEditingValue = (selection) => {
    setEditingId(selection.id);
    setValueInput(String(selection.currentValue));
    setNotesInput('');
  };

  const submitValue = async (id) => {
    setBusyId(id);
    try {
      await updatePlanSelectionValueRequest(id, Number(valueInput), notesInput);
      setMessage({ type: 'success', text: "Client's portfolio value updated." });
      setEditingId(null);
      await load();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Unable to update value.' });
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loader label="Loading plan selections..." />;

  return (
    <div>
      {message && (
        <div className="mb-4">
          <Alert variant={message.type} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        </div>
      )}
      {selections.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">No plan selections yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="py-3 pr-4">Client</th>
                <th className="py-3 pr-4">Plan</th>
                <th className="py-3 pr-4">Invested</th>
                <th className="py-3 pr-4">Current Value</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selections.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 align-top">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-brand-black">
                      {s.clientFirstName} {s.clientLastName}
                    </p>
                    <p className="text-xs text-gray-500">{s.clientEmail}</p>
                  </td>
                  <td className="py-3 pr-4 font-medium text-brand-black">{s.planName}</td>
                  <td className="py-3 pr-4">{formatCurrency(s.investedAmount)}</td>
                  <td className="py-3 pr-4">
                    {editingId === s.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={valueInput}
                        onChange={(e) => setValueInput(e.target.value)}
                        className="w-28 rounded border border-gray-300 px-2 py-1 text-sm"
                      />
                    ) : (
                      formatCurrency(s.currentValue)
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="py-3 pr-4">
                    {s.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(s.id)}
                          disabled={busyId === s.id}
                          className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(s.id)}
                          disabled={busyId === s.id}
                          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {s.status === 'active' &&
                      (editingId === s.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => submitValue(s.id)}
                            disabled={busyId === s.id}
                            className="rounded-md bg-brand-black px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditingValue(s)}
                          className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                        >
                          Adjust Value
                        </button>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PlanPerformanceTab() {
  const [plans, setPlans] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ investmentId: '', periodLabel: '', returnPercent: '', notes: '' });

  const load = async () => {
    setLoading(true);
    try {
      const [plansRes, entriesRes] = await Promise.allSettled([
        getInvestmentsRequest(),
        getAllPlanPerformanceRequest()
      ]);
      if (plansRes.status === 'fulfilled') setPlans(plansRes.value.data.investments || []);
      if (entriesRes.status === 'fulfilled') setEntries(entriesRes.value.data.entries || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!form.investmentId || !form.periodLabel || form.returnPercent === '') {
      setMessage({ type: 'error', text: 'Plan, period label, and return percent are required.' });
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await applyPlanPerformanceRequest({
        investmentId: form.investmentId,
        periodLabel: form.periodLabel,
        returnPercent: Number(form.returnPercent),
        notes: form.notes
      });
      setMessage({ type: 'success', text: data.message });
      setForm({ investmentId: '', periodLabel: '', returnPercent: '', notes: '' });
      await load();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Unable to apply this period return.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading plan performance..." />;

  return (
    <div>
      {message && (
        <div className="mb-4">
          <Alert variant={message.type} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Plan
          </label>
          <select
            value={form.investmentId}
            onChange={(e) => setForm({ ...form, investmentId: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select a plan</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Period label"
          name="periodLabel"
          placeholder="e.g. July 2026"
          value={form.periodLabel}
          onChange={(e) => setForm({ ...form, periodLabel: e.target.value })}
        />
        <Input
          label="Return % (real, reported)"
          name="returnPercent"
          type="number"
          step="0.01"
          placeholder="e.g. 2.3 or -1.5"
          value={form.returnPercent}
          onChange={(e) => setForm({ ...form, returnPercent: e.target.value })}
        />
        <Input
          label="Notes (optional)"
          name="notes"
          placeholder="Internal note"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <div className="flex items-end">
          <Button type="submit" loading={submitting} fullWidth>
            Apply to All Active Accounts
          </Button>
        </div>
      </form>

      <p className="mb-6 text-xs text-gray-400">
        This applies the entered return to every currently active client account in the selected
        plan, in one action. Only use this to report a real, actual result for that period — this
        never runs automatically.
      </p>

      <h3 className="mb-3 text-sm font-semibold text-brand-black">History</h3>
      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">No performance entries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="py-3 pr-4">Plan</th>
                <th className="py-3 pr-4">Period</th>
                <th className="py-3 pr-4">Return</th>
                <th className="py-3 pr-4">Accounts Applied</th>
                <th className="py-3 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-brand-black">{e.planName}</td>
                  <td className="py-3 pr-4">{e.periodLabel}</td>
                  <td
                    className={`py-3 pr-4 font-semibold ${
                      Number(e.returnPercent) >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {Number(e.returnPercent) >= 0 ? '+' : ''}
                    {Number(e.returnPercent).toFixed(2)}%
                  </td>
                  <td className="py-3 pr-4">{e.accountsApplied}</td>
                  <td className="py-3 pr-4 text-gray-500">{formatDate(e.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
    if (activeTab === 'deposits' || activeTab === 'withdrawals') {
      loadData();
    }
  }, [activeTab]);

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

  const tabs = [
    { key: 'deposits', label: 'Deposit Requests', badge: pendingDepositsCount },
    { key: 'withdrawals', label: 'Withdrawal Requests', badge: pendingWithdrawalsCount },
    { key: 'plan-selections', label: 'Plan Selections' },
    { key: 'plan-performance', label: 'Plan Performance' }
  ];

  return (
    <div className="container-page section">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-black">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review client requests, manage plan selections, and report plan performance.
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

      <Card>
        <div className="mb-6 flex flex-wrap gap-3 border-b border-gray-200 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${
                activeTab === tab.key
                  ? 'bg-brand-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
              {!!tab.badge && (
                <span className="ml-2 rounded-full bg-brand-yellow px-2 py-0.5 text-xs font-bold text-brand-black">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
          {(activeTab === 'deposits' || activeTab === 'withdrawals') && (
            <Button variant="outline" onClick={loadData} className="ml-auto">
              Refresh
            </Button>
          )}
        </div>

        {activeTab === 'deposits' &&
          (loading ? (
            <Loader label="Loading requests..." />
          ) : (
            <RequestTable
              rows={deposits}
              type="deposit"
              onUpdateStatus={handleUpdateDeposit}
              updatingId={updatingId}
            />
          ))}
        {activeTab === 'withdrawals' &&
          (loading ? (
            <Loader label="Loading requests..." />
          ) : (
            <RequestTable
              rows={withdrawals}
              type="withdrawal"
              onUpdateStatus={handleUpdateWithdrawal}
              updatingId={updatingId}
            />
          ))}
        {activeTab === 'plan-selections' && <PlanSelectionsTab />}
        {activeTab === 'plan-performance' && <PlanPerformanceTab />}
      </Card>
    </div>
  );
}

export default AdminDashboardPage;
