import React from 'react';
import styles from './Common.module.css';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  title = 'No items found',
  description = 'There are no records to display at this time.',
  icon: Icon = Inbox,
  action,
}) => {
  return (
    <div className={styles.emptyState}>
      <Icon size={48} className={styles.emptyIcon} />
      <h3 className={styles.emptyTitle}>{title}</h3>
      <p className={styles.emptyDescription}>{description}</p>
      {action && <div style={{ marginTop: '1rem' }}>{action}</div>}
    </div>
  );
};
