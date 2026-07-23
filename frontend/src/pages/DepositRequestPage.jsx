import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import Card from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import Alert from '../components/common/Alert.jsx';
import { createDepositRequest } from '../api/transactionApi.js';
import { isPositiveNumber, isRequired } from '../utils/validators.js';

const methods = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'wire_transfer', label: 'Wire Transfer' },
  { value: 'check', label: 'Check Deposit' }
];

function DepositRequestPage() {
  const [form, setForm] = useState({ amount: '', method: 'bank_transfer', notes: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!isPositiveNumber(form.amount)) newErrors.amount = 'Enter a valid deposit amount.';
    if (!isRequired(form.method)) newErrors.method = 'Select a deposit method.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    setConfirmation(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await createDepositRequest({
        amount: Number(form.amount),
        method: form.method,
        notes: form.notes
      });
      setConfirmation(data.deposit || data);
      setForm({ amount: '', method: 'bank_transfer', notes: '' });
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          'Unable to submit your deposit request right now. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-black">Deposit Request</h1>
        <p className="mt-1 text-sm text-gray-500">
          Submit a request to add funds to your managed account. Our
          operations team will confirm once funds are received.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          {serverError && (
            <div className="mb-5">
              <Alert variant="error" onClose={() => setServerError('')}>
                {serverError}
              </Alert>
            </div>
          )}

          {confirmation && (
            <div className="mb-5">
              <Alert variant="success" onClose={() => setConfirmation(null)}>
                Deposit request submitted
                {confirmation.reference ? ` — reference #${confirmation.reference}` : ''}.
                Our team will review and confirm shortly.
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Deposit Amount (USD)"
              name="amount"
              type="number"
              min="1"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="1000.00"
              error={errors.amount}
              required
            />
            <div>
              <label htmlFor="method" className="label-field">
                Deposit Method <span className="text-red-500">*</span>
              </label>
              <select
                id="method"
                name="method"
                value={form.method}
                onChange={handleChange}
                className="input-field"
              >
                {methods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              {errors.method && (
                <p className="mt-1 text-xs text-red-600">{errors.method}</p>
              )}
            </div>
            <div>
              <label htmlFor="notes" className="label-field">
                Additional Notes (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={form.notes}
                onChange={handleChange}
                placeholder="Any relevant details for our operations team"
                className="input-field resize-none"
              />
            </div>
            <Button type="submit" fullWidth loading={loading}>
              Submit Deposit Request
            </Button>
          </form>
        </Card>

        <Card title="What Happens Next">
          <ol className="space-y-4 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-yellow text-xs font-bold text-brand-black">1</span>
              Your deposit request is submitted to our operations team for review.
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-yellow text-xs font-bold text-brand-black">2</span>
              You will receive confirmation and any required funding instructions.
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-yellow text-xs font-bold text-brand-black">3</span>
              Once funds are received, your account balance is updated and reflected on your dashboard.
            </li>
          </ol>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DepositRequestPage;
