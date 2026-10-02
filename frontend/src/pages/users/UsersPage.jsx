import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { useToast } from '../../hooks/useToast';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { TextInput } from '../../components/forms/TextInput';
import { SelectInput } from '../../components/forms/SelectInput';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { Trash2, Edit, Users, ShieldCheck, Building, GraduationCap } from 'lucide-react';
import { ROLES } from '../../constants/roles';
import styles from '../../components/common/Common.module.css';

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'OWNERS', 'CUSTOMERS', 'ADMINS'
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      // GET /api/users
      const data = await userService.getAll();
      setUsers(data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      // PUT /api/users/{id}
      await userService.update(editingUser.id, editingUser);
      showToast('User updated successfully');
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      // DELETE /api/users/{id}
      await userService.delete(deleteTargetId);
      showToast('User deleted successfully');
      setDeleteTargetId(null);
      loadUsers();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const ownerUsers = (Array.isArray(users) ? users : []).filter((u) => u && u.role === ROLES.OWNER);
  const customerUsers = (Array.isArray(users) ? users : []).filter((u) => u && u.role === ROLES.CUSTOMER);
  const adminUsers = (Array.isArray(users) ? users : []).filter((u) => u && u.role === ROLES.ADMIN);

  const renderUserTable = (userList) => (
    <div className={styles.tableResponsive}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((u) => (
            <tr key={u.id}>
              <td>#{u.id}</td>
              <td>
                <strong>
                  {u.firstName} {u.lastName}
                </strong>
              </td>
              <td>{u.email}</td>
              <td>{u.phoneNumber}</td>
              <td>
                <Badge status={u.role}>{u.role}</Badge>
              </td>
              <td>
                <div className="d-flex gap-1">
                  <button
                    className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                    onClick={() => setEditingUser(u)}
                    title="Edit User"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                    onClick={() => setDeleteTargetId(u.id)}
                    title="Delete User"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) return <LoadingSpinner text="Loading users..." />;

  return (
    <div>
      <div className="d-flex justify-between align-center" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>System Users Management</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            Manage platform accounts categorized by PG Owners, Customers, and Administrators
          </p>
        </div>
        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
          Total Registered Users: {users.length}
        </span>
      </div>

      {/* Tab Navigation Controls */}
      <div
        className="d-flex gap-2"
        style={{
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          className={`${styles.btn} ${activeTab === 'ALL' ? styles.btnPrimary : styles.btnSecondary}`}
          onClick={() => setActiveTab('ALL')}
        >
          <Users size={16} /> All Accounts ({users.length})
        </button>
        <button
          type="button"
          className={`${styles.btn} ${activeTab === 'OWNERS' ? styles.btnPrimary : styles.btnSecondary}`}
          onClick={() => setActiveTab('OWNERS')}
        >
          <Building size={16} /> PG Owners ({ownerUsers.length})
        </button>
        <button
          type="button"
          className={`${styles.btn} ${activeTab === 'CUSTOMERS' ? styles.btnPrimary : styles.btnSecondary}`}
          onClick={() => setActiveTab('CUSTOMERS')}
        >
          <GraduationCap size={16} /> Customers ({customerUsers.length})
        </button>
        <button
          type="button"
          className={`${styles.btn} ${activeTab === 'ADMINS' ? styles.btnPrimary : styles.btnSecondary}`}
          onClick={() => setActiveTab('ADMINS')}
        >
          <ShieldCheck size={16} /> System Administrators ({adminUsers.length})
        </button>
      </div>

      {editingUser && (
        <div className={styles.card} style={{ marginBottom: '2rem' }}>
          <h3>Edit User Profile (#{editingUser.id})</h3>
          <form onSubmit={handleUpdate} style={{ marginTop: '1rem' }}>
            <div className="d-flex gap-2">
              <div style={{ flex: 1 }}>
                <TextInput
                  label="First Name"
                  name="firstName"
                  value={editingUser.firstName}
                  onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <TextInput
                  label="Last Name"
                  name="lastName"
                  value={editingUser.lastName}
                  onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <TextInput
              label="Email"
              name="email"
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              required
            />
            <TextInput
              label="Phone Number"
              name="phoneNumber"
              value={editingUser.phoneNumber}
              onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
              required
            />
            <TextInput
              label="New Password (optional)"
              name="password"
              type="password"
              value={editingUser.password || ''}
              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
              placeholder="Leave blank to keep existing password"
            />
            <SelectInput
              label="Role"
              name="role"
              value={editingUser.role}
              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
              options={[
                { label: 'CUSTOMER', value: ROLES.CUSTOMER },
                { label: 'OWNER', value: ROLES.OWNER },
                { label: 'ADMIN', value: ROLES.ADMIN },
              ]}
              required
            />
            <div className="d-flex gap-2" style={{ marginTop: '1rem' }}>
              <SubmitButton loading={actionLoading}>Update User</SubmitButton>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Section 1: PG Property Owners */}
      {(activeTab === 'ALL' || activeTab === 'OWNERS') && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="d-flex justify-between align-center" style={{ marginBottom: '1rem' }}>
            <h3 className="d-flex align-center gap-1" style={{ fontSize: '1.2rem', margin: 0, color: 'var(--primary)' }}>
              <Building size={20} /> PG Property Owners (Landlords)
            </h3>
            <span
              style={{
                fontSize: '0.85rem',
                backgroundColor: 'var(--bg-subtle)',
                padding: '4px 10px',
                borderRadius: '12px',
                color: 'var(--text-muted)',
              }}
            >
              {ownerUsers.length} Owner(s)
            </span>
          </div>

          {ownerUsers.length === 0 ? (
            <EmptyState
              title="No PG Owners Registered"
              description="There are currently no registered PG Property Owners."
              icon={Building}
            />
          ) : (
            renderUserTable(ownerUsers)
          )}
        </div>
      )}

      {/* Section 2: Customers (Tenants / Students) */}
      {(activeTab === 'ALL' || activeTab === 'CUSTOMERS') && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="d-flex justify-between align-center" style={{ marginBottom: '1rem' }}>
            <h3 className="d-flex align-center gap-1" style={{ fontSize: '1.2rem', margin: 0, color: 'var(--secondary)' }}>
              <GraduationCap size={20} /> Customers (Tenants & Students)
            </h3>
            <span
              style={{
                fontSize: '0.85rem',
                backgroundColor: 'var(--bg-subtle)',
                padding: '4px 10px',
                borderRadius: '12px',
                color: 'var(--text-muted)',
              }}
            >
              {customerUsers.length} Customer(s)
            </span>
          </div>

          {customerUsers.length === 0 ? (
            <EmptyState
              title="No Customers Registered"
              description="There are currently no registered Customers or Tenants."
              icon={GraduationCap}
            />
          ) : (
            renderUserTable(customerUsers)
          )}
        </div>
      )}

      {/* Section 3: System Administrators */}
      {(activeTab === 'ALL' || activeTab === 'ADMINS') && (
        <div style={{ marginBottom: '2rem' }}>
          <div className="d-flex justify-between align-center" style={{ marginBottom: '1rem' }}>
            <h3 className="d-flex align-center gap-1" style={{ fontSize: '1.2rem', margin: 0, color: 'var(--success)' }}>
              <ShieldCheck size={20} /> System Administrators (Admins)
            </h3>
            <span
              style={{
                fontSize: '0.85rem',
                backgroundColor: 'var(--bg-subtle)',
                padding: '4px 10px',
                borderRadius: '12px',
                color: 'var(--text-muted)',
              }}
            >
              {adminUsers.length} Admin Account(s)
            </span>
          </div>

          {adminUsers.length === 0 ? (
            <EmptyState
              title="No Administrators Found"
              description="There are currently no administrator accounts."
              icon={ShieldCheck}
            />
          ) : (
            renderUserTable(adminUsers)
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete User Account"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
        loading={actionLoading}
      />
    </div>
  );
};
