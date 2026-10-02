import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { SelectInput } from '../../components/forms/SelectInput';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import styles from '../../components/common/Common.module.css';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
    });
};

export const PaymentsPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedBookingId = searchParams.get('bookingId');

  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(Boolean(preselectedBookingId));
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { user, isCustomer, isAdmin, isOwner } = useAuth();
  const { showToast } = useToast();

  const [selectedBookingId, setSelectedBookingId] = useState(preselectedBookingId || '');

  const loadData = async () => {
    try {
      setLoading(true);
      const allPayments = await paymentService.getAll() || [];

      if (isCustomer && user?.userId) {
        // Customer: Fetch customer's own bookings and filter payments matching those booking IDs
        const customerBookings = await bookingService.getByCustomer(user.userId) || [];
        const customerBookingIds = new Set(customerBookings.map((b) => Number(b.id)));
        const customerPayments = allPayments.filter((p) => customerBookingIds.has(Number(p.bookingId)));

        setBookings(customerBookings);
        setPayments(customerPayments);
        if (customerBookings.length > 0 && !preselectedBookingId) {
          setSelectedBookingId(customerBookings[0].id);
        }
      } else {
        // Owner / Admin: Fetch all bookings
        const allBookings = await bookingService.getAll() || [];
        setPayments(allPayments);
        setBookings(allBookings);
        if (allBookings.length > 0 && !preselectedBookingId) {
          setSelectedBookingId(allBookings[0].id);
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openRazorpayCheckout = async (targetBookingId) => {
    if (!isCustomer) {
      showToast('Only Customer accounts can initiate Razorpay payment checkout.', 'error');
      return;
    }
    if (!targetBookingId) {
      showToast('Please select a booking to process payment.', 'error');
      return;
    }

    try {
      setActionLoading(true);
      let orderData = null;

      // Always create/refresh Razorpay order on backend: POST /api/payments/create-order
      orderData = await paymentService.createOrder({ bookingId: Number(targetBookingId) });

      // Load Razorpay JS SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        showToast('Failed to load Razorpay SDK. Please check your internet connection.', 'error');
        return;
      }

      // Clamp test amount to max 15000 INR to avoid Razorpay Test Mode account limits
      let testAmount = Number(orderData.amount || 0);
      if (testAmount > 15000) {
        testAmount = 15000;
      }

      // 2. Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TNMQvYTPsR973B',
        amount: Math.round(testAmount * 100),
        currency: 'INR',
        name: 'StayHub Accommodations',
        description: `Payment for Booking #${orderData.bookingId}`,
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          try {
            setActionLoading(true);
            // 3. Verify signature: POST /api/payments/verify
            await paymentService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            showToast('Payment verified successfully! Booking status updated to CONFIRMED.');
            setShowForm(false);
            loadData();
          } catch (err) {
            showToast(`Verification failed: ${err.message}`, 'error');
          } finally {
            setActionLoading(false);
          }
        },
        prefill: {
          name: `${user?.firstName || ''} ${user?.lastName || ''}`,
          email: user?.email || '',
        },
        theme: {
          color: '#4F46E5',
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    openRazorpayCheckout(selectedBookingId);
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      // DELETE /api/payments/{id}
      await paymentService.delete(deleteTargetId);
      showToast('Payment record deleted successfully');
      setDeleteTargetId(null);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const selectedBookingDetails = bookings.find((b) => String(b.id) === String(selectedBookingId));

  if (loading) return <LoadingSpinner text="Loading payment records..." />;

  return (
    <div>
      <div className="d-flex justify-between align-center" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>Payment Transactions</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {isOwner
              ? 'View revenue transactions & payment records across your PG properties'
              : 'Razorpay online payment processing & transaction history'}
          </p>
        </div>
        {isCustomer && (
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> {showForm ? 'Close Form' : 'Initiate Razorpay Payment'}
          </button>
        )}
      </div>

      {showForm && isCustomer && (
        <div className={styles.card} style={{ marginBottom: '2rem' }}>
          <h3>Razorpay Online Payment</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Select a pending booking to generate a Razorpay order and complete payment securely.
          </p>
          <form onSubmit={handleFormSubmit} style={{ marginTop: '1rem' }}>
            <SelectInput
              label="Select Target Booking"
              name="bookingId"
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              options={bookings.map((b) => ({
                label: `Booking #${b.id} - ${b.pgName} (${b.customerName || 'Customer'}) [Status: ${b.status}]`,
                value: b.id,
              }))}
              required
            />

            {selectedBookingDetails && (
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '1rem',
                  borderRadius: 'var(--border-radius)',
                  marginBottom: '1.25rem',
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ marginBottom: '0.25rem' }}>
                  <strong>PG Property:</strong> {selectedBookingDetails.pgName}
                </div>
                <div style={{ marginBottom: '0.25rem' }}>
                  <strong>Room Number:</strong> Room #{selectedBookingDetails.roomNumber}
                </div>
                <div style={{ marginBottom: '0.25rem' }}>
                  <strong>Stay Duration:</strong> {selectedBookingDetails.durationInMonths} Month(s)
                </div>
                <div>
                  <strong>Check-In Date:</strong> {formatDate(selectedBookingDetails.checkInDate)}
                </div>
              </div>
            )}

            <div className="d-flex gap-2" style={{ marginTop: '1rem' }}>
              <SubmitButton loading={actionLoading}>Proceed to Razorpay Checkout</SubmitButton>
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

      {payments.length === 0 ? (
        <EmptyState
          title="No Payment History"
          description={isOwner ? "No payment transactions recorded for your PG properties yet." : "There are currently no recorded payment transactions."}
          icon={CreditCard}
        />
      ) : (
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Booking ID</th>
                <th>Payment Date</th>
                <th>Method</th>
                <th>Razorpay Order ID</th>
                <th>Razorpay Payment ID</th>
                <th>Amount</th>
                <th>Status</th>
                {(isCustomer || isAdmin) && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>Booking #{p.bookingId}</td>
                  <td>{formatDate(p.paymentDate)}</td>
                  <td>{p.paymentMethod || 'RAZORPAY'}</td>
                  <td>
                    <code>{p.razorpayOrderId || 'N/A'}</code>
                  </td>
                  <td>
                    <code>{p.razorpayPaymentId || p.transactionId || 'N/A'}</code>
                  </td>
                  <td>
                    <strong>{formatCurrency(p.amount)}</strong>
                  </td>
                  <td>
                    <Badge status={p.status}>{p.status}</Badge>
                  </td>
                  {(isCustomer || isAdmin) && (
                    <td>
                      <div className="d-flex gap-1">
                        {/* Pay Now button is STRICTLY ONLY for Customers */}
                        {p.status === 'PENDING' && p.razorpayOrderId && isCustomer && (
                          <button
                            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
                            onClick={() => openRazorpayCheckout(p.bookingId)}
                            disabled={actionLoading}
                          >
                            Pay Now
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                            onClick={() => setDeleteTargetId(p.id)}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Payment Entry"
        message="Are you sure you want to delete this payment record?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
        loading={actionLoading}
      />
    </div>
  );
};
