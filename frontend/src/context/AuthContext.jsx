import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    isAuthenticated: false,
    role: 'consumer',
    name: 'Guest User',
    email: ''
  });

  function login(role = 'consumer', email = '') {
    const safeRole = role === 'creator' ? 'creator' : 'consumer';
    setUser({
      isAuthenticated: true,
      role: safeRole,
      name: safeRole === 'creator' ? 'Creator User' : 'Viewer User',
      email
    });
  }

  function logout() {
    setUser({
      isAuthenticated: false,
      role: 'consumer',
      name: 'Guest User',
      email: ''
    });
  }

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
