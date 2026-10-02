import React from 'react';
import styles from './Common.module.css';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading data...' }) => {
  return (
    <div className={styles.spinnerOverlay}>
      <Loader2 className={styles.spinner} size={36} />
      {text && <p className={styles.spinnerText}>{text}</p>}
    </div>
  );
};
