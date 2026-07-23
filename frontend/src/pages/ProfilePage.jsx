import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import Card from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import Alert from '../components/common/Alert.jsx';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { getProfileRequest, updateProfileRequest } from '../api/userApi.js';
import { changePasswordRequest } from '../api/authApi.js';
import { isRequired, isValidEmail, isStrongPassword } from '../utils/validators.js';

function ProfilePage() {
  const { user, updateUserInContext } = useAuth();
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setLoading(true);
      try {
        const { data } = await getProfileRequest();
        const profile = data.user || data;
        if (isMounted) {
          setProfileForm({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            email: profile.email || '',
            phone: profile.phone || '',
            address: profile.address || ''
          });
        }
      } catch (error) {
        if (isMounted) {
          setProfileForm({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: user?.address || ''
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!isRequired(profileForm.firstName)) newErrors.firstName = 'First name is required.';
    if (!isRequired(profileForm.lastName)) newErrors.lastName = 'Last name is required.';
    if (!isValidEmail(profileForm.email)) newErrors.email = 'Enter a valid email address.';
    if (!isRequired(profileForm.phone)) newErrors.phone = 'Phone number is required.';
    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!isRequired(passwordForm.currentPassword))
      newErrors.currentPassword = 'Current password is required.';
    if (!isStrongPassword(passwordForm.newPassword))
      newErrors.newPassword = 'New password must be at least 8 characters.';
    if (passwordForm.confirmPassword !== passwordForm.newPassword)
      newErrors.confirmPassword = 'Passwords do not match.';
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileMessage(null);
    if (!validateProfile()) return;

    setSavingProfile(true);
    try {
      const { data } = await updateProfileRequest(profileForm);
      const updatedUser = data.user || data;
      updateUserInContext(updatedUser);
      setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error) {
      setProfileMessage({
        type: 'error',
        text: error.response?.data?.message || 'Unable to update profile. Please try again.'
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage(null);
    if (!validatePassword()) return;

    setSavingPassword(true);
    try {
      await changePasswordRequest({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordMessage({
        type: 'error',
        text: error.response?.data?.message || 'Unable to change password. Please try again.'
      });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader label="Loading your profile..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-black">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Personal Information">
          {profileMessage && (
            <div className="mb-5">
              <Alert
                variant={profileMessage.type}
                onClose={() => setProfileMessage(null)}
              >
                {profileMessage.text}
              </Alert>
            </div>
          )}
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="First Name"
                name="firstName"
                value={profileForm.firstName}
                onChange={handleProfileChange}
                error={profileErrors.firstName}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={profileForm.lastName}
                onChange={handleProfileChange}
                error={profileErrors.lastName}
                required
              />
            </div>
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              error={profileErrors.email}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={profileForm.phone}
              onChange={handleProfileChange}
              error={profileErrors.phone}
              required
            />
            <Input
              label="Mailing Address"
              name="address"
              value={profileForm.address}
              onChange={handleProfileChange}
              error={profileErrors.address}
            />
            <Button type="submit" loading={savingProfile}>
              Save Changes
            </Button>
          </form>
        </Card>

        <Card title="Change Password">
          {passwordMessage && (
            <div className="mb-5">
              <Alert
                variant={passwordMessage.type}
                onClose={() => setPasswordMessage(null)}
              >
                {passwordMessage.text}
              </Alert>
            </div>
          )}
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.currentPassword}
              required
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.newPassword}
              required
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.confirmPassword}
              required
            />
            <Button type="submit" variant="secondary" loading={savingPassword}>
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
