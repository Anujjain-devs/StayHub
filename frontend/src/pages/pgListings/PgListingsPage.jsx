import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pgListingService } from '../../services/pgListingService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { getPgPhotos } from '../../utils/dummyPhotos';
import { Building, MapPin, Plus, Trash2, Edit, Eye } from 'lucide-react';
import styles from '../../components/common/Common.module.css';

export const PgListingsPage = () => {
  const [pgListings, setPgListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { user, isOwner, isAdmin } = useAuth();
  const { showToast } = useToast();

  const loadListings = async () => {
    try {
      setLoading(true);
      let data = [];
      if (isOwner && user?.userId) {
        // Owner: Fetch owner's PG listings ONLY
        data = (await pgListingService.getByOwner(user.userId)) || [];
      } else {
        // Admin / Customer: Fetch all PG listings
        data = (await pgListingService.getAll()) || [];
      }
      setPgListings(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [user]);

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      // DELETE /api/pg-listings/{id}
      await pgListingService.delete(deleteTargetId);
      showToast('PG Listing deleted successfully');
      setDeleteTargetId(null);
      loadListings();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading PG listings..." />;

  return (
    <div>
      <div className="d-flex justify-between align-center" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>PG Accommodation Listings</h2>
          <p style={{ color: 'var(--text-muted)' }}>Browse available Paying Guest accommodations</p>
        </div>
        {isOwner && (
          <Link to="/pg-listings/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={18} /> Add PG Listing
          </Link>
        )}
      </div>

      {pgListings.length === 0 ? (
        <EmptyState
          title="No PG Listings Available"
          description="There are currently no registered PG listings."
          icon={Building}
        />
      ) : (
        <div className="grid-3">
          {pgListings.map((pg) => {
            const coverPhotoObj = getPgPhotos(pg.id)[0];
            const coverPhoto = coverPhotoObj.imageUrl;
            const coverCaption = coverPhotoObj.imageName;
            const canManage = isAdmin || (isOwner && pg.ownerId === user?.userId);

            return (
              <div key={pg.id} className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '180px', backgroundColor: 'var(--bg-subtle)' }}>
                  <img
                    src={coverPhoto}
                    alt={coverCaption || pg.pgName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <Badge status={pg.status}>{pg.status}</Badge>
                  </div>
                </div>

                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', margin: '0 0 0.5rem 0' }}>{pg.pgName}</h3>

                  <div
                    className="d-flex align-center gap-1"
                    style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}
                  >
                    <MapPin size={16} color="var(--primary)" /> {pg.address}, {pg.city}, {pg.state}
                  </div>

                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                      marginBottom: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {pg.description}
                  </p>

                  <div
                    className="d-flex justify-between align-center"
                    style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}
                  >
                    <Link to={`/pg-listings/${pg.id}`} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>
                      <Eye size={14} /> View Details
                    </Link>

                    {canManage && (
                      <div className="d-flex gap-1">
                        <Link
                          to={`/pg-listings/${pg.id}/edit`}
                          className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                          onClick={() => setDeleteTargetId(pg.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete PG Listing"
        message="Are you sure you want to delete this PG listing? All associated rooms and amenities will be deleted."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
        loading={actionLoading}
      />
    </div>
  );
};
