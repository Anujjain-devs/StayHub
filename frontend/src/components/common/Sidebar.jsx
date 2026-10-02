import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Sidebar.module.css';
import {
  LayoutDashboard,
  Building,
  BedDouble,
  Sparkles,
  CalendarCheck,
  CreditCard,
  Users,
  Image as ImageIcon,
  User,
} from 'lucide-react';

export const Sidebar = () => {
  const { isAdmin, isOwner, isCustomer } = useAuth();

  const getLinkClass = ({ isActive }) =>
    `${styles.menuItem} ${isActive ? styles.activeMenuItem : ''}`;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sectionTitle}>Main Navigation</div>

      <NavLink to="/dashboard" className={getLinkClass}>
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>

      <NavLink to="/pg-listings" className={getLinkClass}>
        <Building size={18} /> PG Listings
      </NavLink>

      <NavLink to="/rooms" className={getLinkClass}>
        <BedDouble size={18} /> Rooms
      </NavLink>

      {(isOwner || isAdmin) && (
        <>
          <NavLink to="/amenities" className={getLinkClass}>
            <Sparkles size={18} /> Amenities
          </NavLink>

          <NavLink to="/listing-images" className={getLinkClass}>
            <ImageIcon size={18} /> Listing Images
          </NavLink>
        </>
      )}

      <NavLink to="/bookings" className={getLinkClass}>
        <CalendarCheck size={18} /> Bookings
      </NavLink>

      <NavLink to="/payments" className={getLinkClass}>
        <CreditCard size={18} /> Payments
      </NavLink>

      {isAdmin && (
        <>
          <div className={styles.sectionTitle}>Administration</div>
          <NavLink to="/users" className={getLinkClass}>
            <Users size={18} /> Manage Users
          </NavLink>
        </>
      )}

      <div className={styles.sectionTitle}>Account</div>
      <NavLink to="/profile" className={getLinkClass}>
        <User size={18} /> My Profile
      </NavLink>
    </aside>
  );
};
