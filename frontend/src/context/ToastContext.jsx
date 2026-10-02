import React, { createContext, useState, useCallback } from 'react';
import styles from './Toast.module.css';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  const hideToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.type === 'success' ? (
            <CheckCircle className={styles.icon} size={20} />
          ) : (
            <AlertCircle className={styles.icon} size={20} />
          )}
          <span className={styles.message}>{toast.message}</span>
          <button className={styles.closeBtn} onClick={hideToast}>
            <X size={16} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
};
