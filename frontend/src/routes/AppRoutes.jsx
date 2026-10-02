import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

// Roles
import { ROLES } from '../constants/roles';

// Pages
import { HomePage } from '../pages/home/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { UsersPage } from '../pages/users/UsersPage';
import { PgListingsPage } from '../pages/pgListings/PgListingsPage';
import { PgDetailPage } from '../pages/pgListings/PgDetailPage';
import { PgFormPage } from '../pages/pgListings/PgFormPage';
import { RoomsPage } from '../pages/rooms/RoomsPage';
import { AmenitiesPage } from '../pages/amenities/AmenitiesPage';
import { BookingsPage } from '../pages/bookings/BookingsPage';
import { ListingImagesPage } from '../pages/images/ListingImagesPage';
import { PaymentsPage } from '../pages/payments/PaymentsPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { NotFoundPage } from '../pages/errors/NotFoundPage';
import { UnauthorizedPage } from '../pages/errors/UnauthorizedPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Public Routes (Protected from reverse access when already logged in) */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Main Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Authenticated Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pg-listings" element={<PgListingsPage />} />
          <Route path="/pg-listings/:id" element={<PgDetailPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Owner & Admin Property Management Routes */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN]} />}>
            <Route path="/pg-listings/new" element={<PgFormPage />} />
            <Route path="/pg-listings/:id/edit" element={<PgFormPage />} />
            <Route path="/amenities" element={<AmenitiesPage />} />
            <Route path="/listing-images" element={<ListingImagesPage />} />
          </Route>

          {/* Admin Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
