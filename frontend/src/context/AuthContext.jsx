import { createContext, useEffect, useState, useCallback } from 'react';
import { loginRequest, registerRequest } from '../api/authApi.js';
import { getProfileRequest } from '../api/userApi.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('qs_token');
    if (!token) {
      setInitializing(false);
      return;
    }
    try {
      const { data } = await getProfileRequest();
      setUser(data.user || data);
    } catch (err) {
      localStorage.removeItem('qs_token');
      localStorage.removeItem('qs_user');
      setUser(null);
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    setError(null);
    const { data } = await loginRequest({ email, password });
    localStorage.setItem('qs_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    setError(null);
    const { data } = await registerRequest(payload);
    if (data.token) {
      localStorage.setItem('qs_token', data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('qs_token');
    localStorage.removeItem('qs_user');
    setUser(null);
  };

  const updateUserInContext = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        initializing,
        error,
        login,
        register,
        logout,
        updateUserInContext,
        refreshUser: loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
