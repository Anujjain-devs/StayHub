import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../components/common/Common.module.css';

export const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--primary)', margin: 0 }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className={`${styles.btn} ${styles.btnPrimary}`}>
        Return to Home
      </Link>
    </div>
  );
};
