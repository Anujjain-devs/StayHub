import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { pgListingService } from '../../services/pgListingService';
import { roomService } from '../../services/roomService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { DateInput } from '../../components/forms/DateInput';
import { NumberInput } from '../../components/forms/NumberInput';
import { SelectInput } from '../../components/forms/SelectInput';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { formatDate } from '../../utils/formatters';
import { CalendarCheck, Plus, Trash2, CreditCard } from 'lucide-react';
import styles from '../../components/common/Common.module.css';

export const BookingsPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedRoomId = searchParams.get('roomId');
  const preselectedPgId = searchParams.get('pgListingId');
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [pgListings, setPgListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(Boolean(preselectedRoomId || preselectedPgId));
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { user, isCustomer, isOwner, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    checkInDate: new Date().toISOString().split('T')[0],
    durationInMonths: 1,
    customerId: user?.userId || 0,
    roomId: preselectedRoomId || '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      let data = [];
      if (isCustomer) {
        // GET /api/bookings/customer/{customerId}
        data = await bookingService.getByCustomer(user.userId);
      } else if (isOwner && user?.userId) {
        // Owner: Fetch owner's PG listings and filter bookings to show ONLY bookings for owner's PGs
        const ownerPgs = (await pgListingService.getByOwner(user.userId)) || [];
        const ownerPgNames = new Set(ownerPgs.map((p) => p.pgName?.trim().toLowerCase()));
        const ownerPgIds = new Set(ownerPgs.map((p) => Number(p.id)));

        const allBookings = (await bookingService.getAll()) || [];
        data = allBookings.filter((b) => {
          if (b.pgListingId) {
            return ownerPgIds.has(Number(b.pgListingId));
          }
          if (b.pgName) {
            return ownerPgNames.has(b.pgName.trim().toLowerCase());
          }
          return false;
        });
      } else {
        // Admin: GET /api/bookings (System wide)
        data = await bookingService.getAll();
      }
      const roomData = (await roomService.getAll()) || [];
      const pgData = (await pgListingService.getAll()) || [];

      setBookings(data || []);
      setRooms(roomData || []);
      setPgListings(pgData || []);

      const availableRooms = preselectedPgId
        ? roomData.filter((r) => String(r.pgListingId) === String(preselectedPgId))
        : roomData;

      if (availableRooms.length > 0 && !preselectedRoomId) {
        setFormData((prev) => ({ ...prev, roomId: availableRooms[0].id }));
      }
    } catch (err) {
      showToast(err.message, 'error');
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
    if (!isCustomer) {
      showToast('Only Customer accounts can create new room bookings.', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        checkInDate: formData.checkInDate,
        durationInMonths: Number(formData.durationInMonths),
        customerId: user.userId,
        roomId: Number(formData.roomId),
      };
      // POST /api/bookings
      await bookingService.create(payload);
      showToast('Booking request submitted successfully!');
      setShowForm(false);
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
      // DELETE /api/bookings/{id}
      await bookingService.delete(deleteTargetId);
      showToast('Booking cancelled successfully!');
      setDeleteTargetId(null);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const pgMap = (Array.isArray(pgListings) ? pgListings : []).filter(Boolean).reduce((acc, p) => {
    if (p && p.id) acc[p.id] = p;
    return acc;
  }, {});

  const selectableRooms = preselectedPgId
    ? rooms.filter((r) => String(r.pgListingId) === String(preselectedPgId))
    : rooms;

  const selectedRoomDetails = rooms.find((r) => String(r.id) === String(formData.roomId));

  const [statusTab, setStatusTab] = useState('ALL'); // 'ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'

  const confirmedCount = (bookings || []).filter((b) => b && b.status === 'CONFIRMED').length;
  const pendingCount = (bookings || []).filter((b) => b && b.status === 'PENDING').length;
  const cancelledCount = (bookings || []).filter((b) => b && b.status === 'CANCELLED').length;

  const filteredBookings = (bookings || []).filter((b) => {
    if (!b) return false;
    if (statusTab === 'ALL') return true;
    return b.status === statusTab;
  });

  if (loading) return <LoadingSpinner text="Loading bookings..." />;

  return (
    <div>
      <div className="d-flex justify-between align-center" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>Room Bookings</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {isOwner
              ? 'View and manage customer bookings across your PG properties'
              : 'View and manage your accommodation room bookings'}
          </p>
        </div>
        {isCustomer && (
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> {showForm ? 'Close Booking Form' : 'New Room Booking'}
          </button>
        )}
      </div>

      {/* Booking Status Filter Tabs */}
      <div
        className="d-flex gap-2"
        style={{
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          className={`${styles.btn} ${statusTab === 'ALL' ? styles.btnPrimary : styles.btnSecondary}`}
          onClick={() => setStatusTab('ALL')}
        >
          All Bookings ({bookings.length})
        </button>
        <button
          type="button"
          className={`${styles.btn} ${statusTab === 'CONFIRMED' ? styles.btnPrimary : styles.btnSecondary}`}
          onClick={() => setStatusTab('CONFIRMED')}
        >
          Confirmed ({confirmedCount})
        </button>
        <button
          type="button"
          className={`${styles.btn} ${statusTab === 'PENDING' ? styles.btnPrimary : styles.btnSecondary}`}
          onClick={() => setStatusTab('PENDING')}
        >
          Pending Payment ({pendingCount})
        </button>
        <button
          type="button"
          className={`${styles.btn} ${statusTab === 'CANCELLED' ? styles.btnPrimary : styles.btnSecondary}`}
          onClick={() => setStatusTab('CANCELLED')}
        >
          Cancelled ({cancelledCount})
        </button>
      </div>

      {showForm && isCustomer && (
        <div className={styles.card} style={{ marginBottom: '2rem' }}>
          <h3>Create New Room Booking</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <SelectInput
              label="Select Available Room"
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              options={selectableRooms.map((r) => {
                const pgName = pgMap[r.pgListingId]?.pgName || (r.pgName ? r.pgName : `PG #${r.pgListingId}`);
                return {
                  label: `${pgName} - Room #${r.roomNumber} (${r.sharingType}) - ${r.availableBeds} bed(s) left - ₹${r.pricePerMonth}/mo`,
                  value: r.id,
                };
              })}
              required
            />

            {selectedRoomDetails && (
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--border-radius)',
                  marginBottom: '1.25rem',
                  fontSize: '0.9rem',
                  borderLeft: '4px solid var(--primary)',
                }}
              >
                <div style={{ marginBottom: '0.25rem' }}>
                  <strong>Selected PG Property:</strong>{' '}
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    {pgMap[selectedRoomDetails.pgListingId]?.pgName || selectedRoomDetails.pgName || `PG #${selectedRoomDetails.pgListingId}`}
                  </span>
                </div>
                <div style={{ marginBottom: '0.25rem' }}>
                  <strong>Room Details:</strong> Room #{selectedRoomDetails.roomNumber} ({selectedRoomDetails.sharingType}) &bull; Floor {selectedRoomDetails.floorNumber}
                </div>
                <div>
                  <strong>Rent & Availability:</strong> ₹{selectedRoomDetails.pricePerMonth} / Month &bull;{' '}
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                    {selectedRoomDetails.availableBeds} bed(s) available
                  </span>
                </div>
              </div>
            )}

            <div className="d-flex gap-2">
              <div style={{ flex: 1 }}>
                <DateInput
                  label="Check-In Date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <NumberInput
                  label="Stay Duration (Months)"
                  name="durationInMonths"
                  value={formData.durationInMonths}
                  onChange={handleChange}
                  min={1}
                  max={24}
                  required
                />
              </div>
            </div>

            <div className="d-flex gap-2" style={{ marginTop: '1rem' }}>
              <SubmitButton loading={actionLoading}>Confirm Booking Request</SubmitButton>
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

      {filteredBookings.length === 0 ? (
        <EmptyState
          title="No Bookings Found"
          description={
            statusTab !== 'ALL'
              ? `There are currently no ${statusTab.toLowerCase()} bookings.`
              : isOwner
              ? 'No customer bookings recorded yet for your PG properties.'
              : 'You currently have no bookings recorded.'
          }
          icon={CalendarCheck}
        />
      ) : (
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>PG Name</th>
                <th>Room No.</th>
                <th>Customer</th>
                <th>Booking Date</th>
                <th>Check-In Date</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>
                    <strong>{b.pgName || 'N/A'}</strong>
                  </td>
                  <td>Room #{b.roomNumber || 'N/A'}</td>
                  <td>{b.customerName || 'N/A'}</td>
                  <td>{formatDate(b.bookingDate)}</td>
                  <td>{formatDate(b.checkInDate)}</td>
                  <td>{b.durationInMonths} Month(s)</td>
                  <td>
                    <Badge status={b.status}>{b.status}</Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      {/* Pay button is ONLY for Customers */}
                      {b.status === 'PENDING' && isCustomer && (
                        <button
                          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
                          onClick={() => navigate(`/payments?bookingId=${b.id}`)}
                          title="Proceed to Payment"
                        >
                          <CreditCard size={14} /> Pay
                        </button>
                      )}
                      {(isCustomer || isOwner || isAdmin) && b.status !== 'CANCELLED' && (
                        <button
                          className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                          onClick={() => setDeleteTargetId(b.id)}
                          title="Cancel Booking"
                        >
                          <Trash2 size={14} /> Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This will restore bed availability."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
        loading={actionLoading}
      />
    </div>
  );
};
