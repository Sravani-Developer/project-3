import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(payload) {
    const data = await api.login(payload);
    setUser(data.user);
    return data.user;
  }

  async function signup(payload) {
    const data = await api.signup(payload);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await api.logout();
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), isLoading, login, signup, logout, setUser }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }
  return context;
}
