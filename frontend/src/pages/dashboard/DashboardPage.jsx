import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { pgListingService } from '../../services/pgListingService';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import { roomService } from '../../services/roomService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Building, CalendarCheck, CreditCard, BedDouble, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from '../../components/common/Common.module.css';

export const DashboardPage = () => {
  const { user, isAdmin, isOwner, isCustomer } = useAuth();
  const [stats, setStats] = useState({
    pgCount: 0,
    bookingCount: 0,
    paymentCount: 0,
    roomCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        let pgs = [];
        let bookings = [];
        let rooms = [];

        const allPgs = (await pgListingService.getAll()) || [];
        const allBookings = (await bookingService.getAll()) || [];
        const allRooms = (await roomService.getAll()) || [];

        if (isOwner && user?.userId) {
          pgs = (await pgListingService.getByOwner(user.userId)) || [];
          const ownerPgIds = new Set(pgs.map((p) => Number(p.id)));
          const ownerPgNames = new Set(pgs.map((p) => p.pgName?.trim().toLowerCase()));

          bookings = allBookings.filter(
            (b) => ownerPgIds.has(Number(b.pgListingId)) || ownerPgNames.has(b.pgName?.trim().toLowerCase())
          );
          rooms = allRooms.filter((r) => ownerPgIds.has(Number(r.pgListingId)));
        } else if (isCustomer && user?.userId) {
          pgs = allPgs;
          bookings = (await bookingService.getByCustomer(user.userId)) || [];
          rooms = allRooms;
        } else {
          pgs = allPgs;
          bookings = allBookings;
          rooms = allRooms;
        }

        setStats({
          pgCount: pgs.length || 0,
          bookingCount: bookings.length || 0,
          roomCount: rooms.length || 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user, isAdmin, isOwner, isCustomer]);

  if (loading) {
    return <LoadingSpinner text="Loading dashboard data..." />;
  }

  return (
    <div>
      <div className="d-flex justify-between align-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h2>Welcome back, {user?.firstName}!</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Role: <strong>{user?.role}</strong> | Overview of your StayHub activities
          </p>
        </div>
        {isOwner && (
          <Link to="/pg-listings/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            <PlusCircle size={18} /> Add New PG
          </Link>
        )}
      </div>

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className={styles.card}>
          <div className="d-flex justify-between align-center">
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                {isOwner ? 'My PG Listings' : 'Total PG Listings'}
              </p>
              <h3 style={{ fontSize: '1.8rem', margin: '0.25rem 0 0 0' }}>{stats.pgCount}</h3>
            </div>
            <Building color="var(--primary)" size={32} />
          </div>
          <Link to="/pg-listings" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.85rem' }}>
            View all listings &rarr;
          </Link>
        </div>

        <div className={styles.card}>
          <div className="d-flex justify-between align-center">
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                {isOwner ? 'My PG Bookings' : isCustomer ? 'My Bookings' : 'Total System Bookings'}
              </p>
              <h3 style={{ fontSize: '1.8rem', margin: '0.25rem 0 0 0' }}>{stats.bookingCount}</h3>
            </div>
            <CalendarCheck color="var(--success)" size={32} />
          </div>
          <Link to="/bookings" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.85rem' }}>
            View bookings &rarr;
          </Link>
        </div>

        <div className={styles.card}>
          <div className="d-flex justify-between align-center">
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                {isOwner ? 'My Available Rooms' : 'Available Rooms'}
              </p>
              <h3 style={{ fontSize: '1.8rem', margin: '0.25rem 0 0 0' }}>{stats.roomCount}</h3>
            </div>
            <BedDouble color="var(--secondary)" size={32} />
          </div>
          <Link to="/rooms" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.85rem' }}>
            View room inventory &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
