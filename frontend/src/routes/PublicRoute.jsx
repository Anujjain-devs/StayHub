import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Checking authentication status..." />;
  }

  if (isAuthenticated) {
    // If the user was redirected to login from a protected page, send them back there; otherwise to /dashboard
    const from = location.state?.from?.pathname
      ? location.state.from.pathname + (location.state.from.search || '')
      : '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};
