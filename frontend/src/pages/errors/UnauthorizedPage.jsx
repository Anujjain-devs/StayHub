import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../components/common/Common.module.css';

export const UnauthorizedPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--danger)', margin: 0 }}>403</h1>
      <h2>Access Forbidden</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        You do not have permission to access this resource or perform this action.
      </p>
      <Link to="/dashboard" className={`${styles.btn} ${styles.btnPrimary}`}>
        Back to Dashboard
      </Link>
    </div>
  );
};
