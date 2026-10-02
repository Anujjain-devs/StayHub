import React from 'react';
import styles from './FormComponents.module.css';
import { Loader2 } from 'lucide-react';

export const SubmitButton = ({
  loading = false,
  children = 'Submit',
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={`${styles.submitBtn} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={18} /> Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};
