import React from 'react';
import styles from './Common.module.css';

export const Badge = ({ children, status }) => {
  const getBadgeClass = (val) => {
    if (!val) return styles.badgeInfo;
    const str = String(val).toUpperCase();
    if (['ACTIVE', 'SUCCESS', 'CONFIRMED', 'ADMIN'].includes(str)) return styles.badgeSuccess;
    if (['PENDING'].includes(str)) return styles.badgePending;
    if (['INACTIVE', 'CANCELLED', 'FAILED'].includes(str)) return styles.badgeDanger;
    if (['OWNER', 'CHECKED_IN'].includes(str)) return styles.badgeInfo;
    if (['CUSTOMER'].includes(str)) return styles.badgeRoleCustomer;
    return styles.badgeInfo;
  };

  return <span className={`${styles.badge} ${getBadgeClass(status || children)}`}>{children}</span>;
};
