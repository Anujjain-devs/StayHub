import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { roomService } from '../../services/roomService';
import { pgListingService } from '../../services/pgListingService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { TextInput } from '../../components/forms/TextInput';
import { NumberInput } from '../../components/forms/NumberInput';
import { SelectInput } from '../../components/forms/SelectInput';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { formatCurrency, formatEnumValue } from '../../utils/formatters';
import { Plus, Trash2, Edit, BedDouble } from 'lucide-react';
import styles from '../../components/common/Common.module.css';

export const RoomsPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedPgId = searchParams.get('pgListingId');

  const [rooms, setRooms] = useState([]);
  const [pgListings, setPgListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(Boolean(preselectedPgId));
  const [editingRoom, setEditingRoom] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { user, isOwner, isAdmin, isCustomer } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    roomNumber: '',
    sharingType: 'SINGLE',
    floorNumber: 1,
    totalBeds: 1,
    availableBeds: 1,
    pricePerMonth: 5000,
    genderPreference: 'UNISEX',
    pgListingId: preselectedPgId || '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const rawRoomData = await roomService.getAll();
      const roomData = Array.isArray(rawRoomData) ? rawRoomData : [];

      let rawPgData = [];
      if (isOwner && user?.userId) {
        rawPgData = await pgListingService.getByOwner(user.userId);
      } else {
        rawPgData = await pgListingService.getAll();
      }
      const pgData = Array.isArray(rawPgData) ? rawPgData : [];

      setPgListings(pgData);

      if (isOwner && user?.userId) {
        const ownerPgIds = new Set(pgData.filter(Boolean).map((p) => Number(p.id)));
        const ownerRooms = roomData.filter((r) => r && ownerPgIds.has(Number(r.pgListingId)));
        setRooms(ownerRooms);
      } else {
        setRooms(roomData);
      }

      if (pgData.length > 0 && !preselectedPgId) {
        setFormData((prev) => ({ ...prev, pgListingId: pgData[0].id }));
      }
    } catch (err) {
      console.error('Error loading rooms data:', err);
      showToast(err?.message || 'Error loading rooms data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOwner && !isAdmin) {
      showToast('Only PG Owners can create or update rooms.', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        ...formData,
        floorNumber: Number(formData.floorNumber),
        totalBeds: Number(formData.totalBeds),
        availableBeds: Number(formData.availableBeds),
        pricePerMonth: Number(formData.pricePerMonth),
        pgListingId: Number(formData.pgListingId),
      };

      if (editingRoom) {
        // PUT /api/rooms/{id}
        await roomService.update(editingRoom.id, payload);
        showToast('Room updated successfully');
      } else {
        // POST /api/rooms
        await roomService.create(payload);
        showToast('Room created successfully');
      }
      setShowForm(false);
      setEditingRoom(null);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      // DELETE /api/rooms/{id}
      await roomService.delete(deleteTargetId);
      showToast('Room deleted successfully');
      setDeleteTargetId(null);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditForm = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      sharingType: room.sharingType,
      floorNumber: room.floorNumber,
      totalBeds: room.totalBeds,
      availableBeds: room.availableBeds,
      pricePerMonth: room.pricePerMonth,
      genderPreference: room.genderPreference,
      pgListingId: room.pgListingId,
    });
    setShowForm(true);
  };

  const pgMap = (Array.isArray(pgListings) ? pgListings : []).filter(Boolean).reduce((acc, p) => {
    if (p && p.id) {
      acc[p.id] = p;
    }
    return acc;
  }, {});

  if (loading) return <LoadingSpinner text="Loading rooms..." />;

  return (
    <div>
      <div className="d-flex justify-between align-center" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>Rooms Inventory</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {isOwner
              ? 'Manage rooms and bed capacities across your PG listings'
              : 'Browse available rooms and bed capacities'}
          </p>
        </div>
        {(isOwner || isAdmin) && (
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => {
              setEditingRoom(null);
              setShowForm(!showForm);
            }}
          >
            <Plus size={18} /> {showForm ? 'Close Form' : 'Add New Room'}
          </button>
        )}
      </div>

      {showForm && (isOwner || isAdmin) && (
        <div className={styles.card} style={{ marginBottom: '2rem' }}>
          <h3>{editingRoom ? `Edit Room #${editingRoom.roomNumber}` : 'Add New Room'}</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <SelectInput
              label="Select Target PG Property"
              name="pgListingId"
              value={formData.pgListingId}
              onChange={handleChange}
              options={(Array.isArray(pgListings) ? pgListings : [])
                .filter(Boolean)
                .map((p) => ({ label: `${p.pgName || 'PG'} (${p.city || ''})`, value: p.id }))}
              required
            />

            <div className="d-flex gap-2">
              <div style={{ flex: 1 }}>
                <TextInput
                  label="Room Number"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  placeholder="e.g. 101, 202-A"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <NumberInput
                  label="Floor Number"
                  name="floorNumber"
                  value={formData.floorNumber}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <div style={{ flex: 1 }}>
                <SelectInput
                  label="Sharing Type"
                  name="sharingType"
                  value={formData.sharingType}
                  onChange={handleChange}
                  options={[
                    { label: 'SINGLE', value: 'SINGLE' },
                    { label: 'DOUBLE', value: 'DOUBLE' },
                    { label: 'TRIPLE', value: 'TRIPLE' },
                    { label: 'FOUR SHARING', value: 'FOUR_SHARING' },
                  ]}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <SelectInput
                  label="Gender Preference"
                  name="genderPreference"
                  value={formData.genderPreference}
                  onChange={handleChange}
                  options={[
                    { label: 'MALE', value: 'MALE' },
                    { label: 'FEMALE', value: 'FEMALE' },
                    { label: 'UNISEX', value: 'UNISEX' },
                  ]}
                  required
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <div style={{ flex: 1 }}>
                <NumberInput
                  label="Total Beds"
                  name="totalBeds"
                  value={formData.totalBeds}
                  onChange={handleChange}
                  min={1}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <NumberInput
                  label="Available Beds"
                  name="availableBeds"
                  value={formData.availableBeds}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <NumberInput
                  label="Price / Month (₹)"
                  name="pricePerMonth"
                  value={formData.pricePerMonth}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </div>
            </div>

            <div className="d-flex gap-2" style={{ marginTop: '1rem' }}>
              <SubmitButton loading={actionLoading}>
                {editingRoom ? 'Update Room' : 'Save Room'}
              </SubmitButton>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {rooms.length === 0 ? (
        <EmptyState
          title="No Rooms Found"
          description={isOwner ? "No rooms recorded yet for your PG properties." : "There are currently no rooms listed."}
          icon={BedDouble}
        />
      ) : (
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Room No.</th>
                <th>PG Property Name</th>
                <th>Floor</th>
                <th>Sharing</th>
                <th>Gender</th>
                <th>Price/Month</th>
                <th>Availability</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td>
                    <strong>Room #{r.roomNumber}</strong>
                  </td>
                  <td>
                    <Link to={`/pg-listings/${r.pgListingId}`} style={{ fontWeight: 600, color: 'var(--primary)' }}>
                      {pgMap[r.pgListingId]?.pgName || `PG #${r.pgListingId}`}
                    </Link>
                  </td>
                  <td>Floor {r.floorNumber}</td>
                  <td>{formatEnumValue(r.sharingType)}</td>
                  <td>{formatEnumValue(r.genderPreference)}</td>
                  <td>
                    <strong>{formatCurrency(r.pricePerMonth)}</strong>
                  </td>
                  <td>
                    <Badge status={r.availableBeds > 0 ? 'ACTIVE' : 'INACTIVE'}>
                      {r.availableBeds} / {r.totalBeds} Beds
                    </Badge>
                  </td>
                  <td>
                    {(isOwner || isAdmin) ? (
                      <div className="d-flex gap-1">
                        <button
                          className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                          onClick={() => openEditForm(r)}
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                          onClick={() => setDeleteTargetId(r.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : isCustomer ? (
                      r.availableBeds > 0 ? (
                        <Link
                          to={`/bookings?roomId=${r.id}`}
                          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
                        >
                          Book Bed
                        </Link>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full</span>
                      )
                    ) : (
                      <Link to="/login" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
                        Log in
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Room Entry"
        message="Are you sure you want to delete this room?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
        loading={actionLoading}
      />
    </div>
  );
};
