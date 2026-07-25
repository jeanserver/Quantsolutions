import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import InvestmentSolutionsPage from '../pages/InvestmentSolutionsPage.jsx';
import FAQPage from '../pages/FAQPage.jsx';
import ContactPage from '../pages/ContactPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import InvestmentPlansPage from '../pages/InvestmentPlansPage.jsx';
import DepositRequestPage from '../pages/DepositRequestPage.jsx';
import WithdrawalRequestPage from '../pages/WithdrawalRequestPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import AdminDashboardPage from '../pages/AdminDashboardPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import AdminRoute from '../components/common/AdminRoute.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/investment-solutions" element={<InvestmentSolutionsPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/investments"
        element={
          <ProtectedRoute>
            <InvestmentPlansPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/deposit"
        element={
          <ProtectedRoute>
            <DepositRequestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/withdrawal"
        element={
          <ProtectedRoute>
            <WithdrawalRequestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
