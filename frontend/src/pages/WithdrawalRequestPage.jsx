import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import Card from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import Alert from '../components/common/Alert.jsx';
import { createWithdrawalRequest } from '../api/transactionApi.js';
import { isPositiveNumber, isRequired } from '../utils/validators.js';

function WithdrawalRequestPage() {
  const [form, setForm] = useState({
    amount: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    notes: ''
  });
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
    if (!isPositiveNumber(form.amount)) newErrors.amount = 'Enter a valid withdrawal amount.';
    if (!isRequired(form.bankName)) newErrors.bankName = 'Bank name is required.';
    if (!isRequired(form.accountName)) newErrors.accountName = 'Account holder name is required.';
    if (!isRequired(form.accountNumber)) newErrors.accountNumber = 'Account number is required.';
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
      const { data } = await createWithdrawalRequest({
        amount: Number(form.amount),
        bankName: form.bankName,
        accountName: form.accountName,
        accountNumber: form.accountNumber,
        notes: form.notes
      });
      setConfirmation(data.withdrawal || data);
      setForm({ amount: '', bankName: '', accountName: '', accountNumber: '', notes: '' });
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          'Unable to submit your withdrawal request right now. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-black">Withdrawal Request</h1>
        <p className="mt-1 text-sm text-gray-500">
          Submit a request to withdraw funds from your account. Requests are
          reviewed by our operations team before processing.
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
                Withdrawal request submitted
                {confirmation.reference ? ` — reference #${confirmation.reference}` : ''}.
                Our team will review and process it shortly.
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Withdrawal Amount (USD)"
              name="amount"
              type="number"
              min="1"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="500.00"
              error={errors.amount}
              required
            />
            <Input
              label="Bank Name"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              placeholder="Chase Bank"
              error={errors.bankName}
              required
            />
            <Input
              label="Account Holder Name"
              name="accountName"
              value={form.accountName}
              onChange={handleChange}
              placeholder="Jane Doe"
              error={errors.accountName}
              required
            />
            <Input
              label="Account Number"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              placeholder="000123456789"
              error={errors.accountNumber}
              required
            />
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
              Submit Withdrawal Request
            </Button>
          </form>
        </Card>

        <Card title="Processing Timeline">
          <ol className="space-y-4 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-black text-xs font-bold text-brand-white">1</span>
              Your request is reviewed by our operations and compliance team.
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-black text-xs font-bold text-brand-white">2</span>
              Identity and account details are verified before funds are released.
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-black text-xs font-bold text-brand-white">3</span>
              You will be notified once the withdrawal has been processed.
            </li>
          </ol>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default WithdrawalRequestPage;
