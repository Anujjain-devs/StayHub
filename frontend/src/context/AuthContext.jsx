import React, { createContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { ROLES } from '../constants/roles';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session directly from storage (no JWT parsing required)
    const savedToken = storage.getToken();
    const savedUser = storage.getUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);

    // Listen for unauthorized 401 events dispatched by apiClient interceptor
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('stayhub:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('stayhub:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback((loginResponseData) => {
    // loginResponseData: { token, role, userId, firstName, lastName }
    storage.setAuth(loginResponseData);
    setToken(loginResponseData.token);
    setUser({
      userId: loginResponseData.userId,
      role: loginResponseData.role,
      firstName: loginResponseData.firstName,
      lastName: loginResponseData.lastName,
    });
  }, []);

  const logout = useCallback(() => {
    storage.clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === ROLES.ADMIN;
  const isOwner = user?.role === ROLES.OWNER;
  const isCustomer = user?.role === ROLES.CUSTOMER;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isOwner,
        isCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
