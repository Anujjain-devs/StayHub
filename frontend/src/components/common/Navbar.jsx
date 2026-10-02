import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css';
import { Home, LogOut, User, LayoutDashboard } from 'lucide-react';
import { Badge } from './Badge';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className="container d-flex justify-between align-center">
        <Link to="/" className={styles.brand}>
          <Home size={24} /> StayHub
        </Link>

        <div className={styles.navLinks}>
          <Link to="/pg-listings" className={styles.navLink}>
            Explore PGs
          </Link>

          {isAuthenticated ? (
            <div className={styles.userInfo}>
              <Link to="/dashboard" className={styles.navLink} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>

              <div className="d-flex align-center gap-1">
                <User size={18} className={styles.navLink} />
                <span className={styles.userName}>
                  {user?.firstName} {user?.lastName}
                </span>
                <Badge status={user?.role}>{user?.role}</Badge>
              </div>

              <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className={styles.navLink} style={{ fontWeight: 600 }}>
                Login
              </Link>
              <Link
                to="/register"
                className="btn btnPrimary btnSm"
                style={{ borderRadius: '6px', textDecoration: 'none', color: '#fff' }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
