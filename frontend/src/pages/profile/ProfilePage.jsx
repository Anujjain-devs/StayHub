import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../../components/common/Badge';
import { User, Mail, Shield } from 'lucide-react';
import styles from '../../components/common/Common.module.css';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>User Profile Overview</h2>

      <div className={styles.card}>
        <div className="d-flex align-center gap-2" style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 700,
            }}
          >
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </div>
          <div>
            <h3 style={{ margin: 0 }}>
              {user?.firstName} {user?.lastName}
            </h3>
            <Badge status={user?.role}>{user?.role}</Badge>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div className="d-flex align-center gap-2" style={{ marginBottom: '1rem' }}>
            <User color="var(--text-muted)" size={18} />
            <div>
              <small style={{ color: 'var(--text-muted)', display: 'block' }}>User Account ID</small>
              <strong>#{user?.userId}</strong>
            </div>
          </div>

          <div className="d-flex align-center gap-2">
            <Shield color="var(--text-muted)" size={18} />
            <div>
              <small style={{ color: 'var(--text-muted)', display: 'block' }}>Assigned System Role</small>
              <strong>{user?.role}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
