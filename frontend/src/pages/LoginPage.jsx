import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import Alert from '../components/common/Alert.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { isValidEmail, isRequired } from '../utils/validators.js';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!isValidEmail(form.email)) newErrors.email = 'Enter a valid email address.';
    if (!isRequired(form.password)) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await login(form.email, form.password);
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container-page flex justify-center">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-card">
          <h1 className="text-2xl font-bold text-brand-black">Welcome Back</h1>
          <p className="mt-1 text-sm text-gray-500">
            Log in to access your QuantSolutions dashboard.
          </p>

          {serverError && (
            <div className="mt-5">
              <Alert variant="error" onClose={() => setServerError('')}>
                {serverError}
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
              required
            />
            <Button type="submit" fullWidth loading={loading}>
              Log In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-black hover:text-brand-yellowDark">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
