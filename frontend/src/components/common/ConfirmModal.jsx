import React from 'react';
import styles from './Common.module.css';
import { X, AlertTriangle } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className="d-flex align-center gap-1">
            <AlertTriangle color="var(--danger)" size={20} />
            <h3 className={styles.modalTitle}>{title}</h3>
          </div>
          <button className={styles.btnSecondary} onClick={onCancel} style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>
        <div className={styles.modalBody}>{message}</div>
        <div className={styles.modalFooter}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>
          <button className={`${styles.btn} ${styles.btnDanger}`} onClick={onConfirm} disabled={loading}>
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
