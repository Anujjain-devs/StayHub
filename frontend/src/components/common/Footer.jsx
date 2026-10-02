import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Home, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          {/* Brand Bio */}
          <div className={styles.brandCol}>
            <Link to="/" className={styles.brandLogo}>
              <Home size={24} /> StayHub
            </Link>
            <p className={styles.brandDesc}>
              StayHub is India's leading PG accommodation management platform, simplifying property discovery, bed booking, and tenancy management for students and PG owners.
            </p>
            <div className="d-flex align-center gap-1" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} color="var(--success)" /> Verified Accommodation Network
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={styles.footerTitle}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/pg-listings" className={styles.footerLink}>
                  Explore PGs
                </Link>
              </li>
              <li>
                <Link to="/rooms" className={styles.footerLink}>
                  Room Inventory
                </Link>
              </li>
              <li>
                <Link to="/bookings" className={styles.footerLink}>
                  Bookings Management
                </Link>
              </li>
              {isAuthenticated ? (
                <li>
                  <Link to="/profile" className={styles.footerLink}>
                    My Profile
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className={styles.footerLink}>
                      User Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className={styles.footerLink}>
                      Register Account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h4 className={styles.footerTitle}>Platform</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/amenities" className={styles.footerLink}>
                  Amenities & Facilities
                </Link>
              </li>
              <li>
                <Link to="/listing-images" className={styles.footerLink}>
                  Property Image Gallery
                </Link>
              </li>
              <li>
                <Link to="/payments" className={styles.footerLink}>
                  Payment Receipts
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className={styles.footerLink}>
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className={styles.footerTitle}>Contact Us</h4>
            <div className={styles.contactItem}>
              <MapPin size={16} color="var(--primary)" /> Tech Park Road, Pune, Maharashtra
            </div>
            <div className={styles.contactItem}>
              <Phone size={16} color="var(--primary)" /> +91 98765 43210
            </div>
            <div className={styles.contactItem}>
              <Mail size={16} color="var(--primary)" /> support@stayhub.com
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div>&copy; {new Date().getFullYear()} StayHub Management System. All rights reserved.</div>
          <div className="d-flex align-center gap-1">
            Built for CDAC PG-DAC Final Project & Placement Portfolio
          </div>
        </div>
      </div>
    </footer>
  );
};
