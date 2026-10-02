import React from 'react';
import styles from './FormComponents.module.css';

export const DateInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  min,
  max,
  disabled = false,
  ...props
}) => {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        disabled={disabled}
        className={`${styles.input} ${error ? styles.errorInput : ''}`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
