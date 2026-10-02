import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { pgListingService } from '../../services/pgListingService';
import { roomService } from '../../services/roomService';
import { amenityService } from '../../services/amenityService';
import { listingImageService } from '../../services/listingImageService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/common/Badge';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { formatCurrency, formatEnumValue } from '../../utils/formatters';
import { getPgPhotos } from '../../utils/dummyPhotos';
import { MapPin, BedDouble, Sparkles, Image as ImageIcon, ArrowLeft, Edit, Trash2, Plus, Settings } from 'lucide-react';
import styles from '../../components/common/Common.module.css';

const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80';

const getImageUrl = (url) => {
  if (!url) return DEFAULT_ROOM_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return url;
};

export const PgDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pg, setPg] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { user, isCustomer, isOwner, isAdmin, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPgDetails = async () => {
      try {
        setLoading(true);
        // GET /api/pg-listings/{id}
        const pgData = await pgListingService.getById(id);
        setPg(pgData);

        // GET /api/rooms/pg/{pgListingId}
        const roomData = await roomService.getByPgListing(id);
        setRooms(roomData || []);

        // GET /api/amenities/pg/{pgListingId}
        const amenityData = await amenityService.getByPgListing(id);
        setAmenities(amenityData || []);

        // GET /api/listing-images/pg/{pgListingId}
        const imageData = await listingImageService.getByPgListing(id);
        setImages(imageData || []);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPgDetails();
  }, [id]);

  const handleDeletePg = async () => {
    try {
      setActionLoading(true);
      // DELETE /api/pg-listings/{id}
      await pgListingService.delete(id);
      showToast('PG Listing deleted successfully');
      navigate('/pg-listings');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching PG details..." />;
  if (!pg) return <div>PG Listing not found</div>;

  const canEditOrDelete = isOwner || isAdmin;
  const displayPhotos = getPgPhotos(id, images);

  return (
    <div>
      <div className="d-flex justify-between align-center" style={{ marginBottom: '1rem' }}>
        <Link to="/pg-listings" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
          <ArrowLeft size={16} /> Back to PG Listings
        </Link>

        {canEditOrDelete && (
          <div className="d-flex gap-2">
            <Link to={`/pg-listings/${pg.id}/edit`} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>
              <Edit size={16} /> Edit PG Listing
            </Link>
            <button
              className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
              onClick={() => setDeleteModalOpen(true)}
            >
              <Trash2 size={16} /> Delete PG
            </button>
          </div>
        )}
      </div>

      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <div className="d-flex justify-between align-center">
          <div>
            <h2>{pg.pgName}</h2>
            <p className="d-flex align-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <MapPin size={18} /> {pg.address}, {pg.city}, {pg.state} - {pg.pincode}
            </p>
          </div>
          <Badge status={pg.status}>{pg.status}</Badge>
        </div>
        <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>{pg.description}</p>

        {canEditOrDelete && (
          <div
            className="d-flex gap-2"
            style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              flexWrap: 'wrap',
            }}
          >
            <Link to={`/rooms?pgListingId=${pg.id}`} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>
              <Plus size={14} /> Add Room
            </Link>
            <Link to={`/amenities?pgListingId=${pg.id}`} className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
              <Plus size={14} /> Add Amenity
            </Link>
            <Link to={`/listing-images?pgListingId=${pg.id}`} className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
              <Plus size={14} /> Upload Photos
            </Link>
          </div>
        )}
      </div>

      {/* Images Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="d-flex justify-between align-center" style={{ marginBottom: '1rem' }}>
          <h3 className="d-flex align-center gap-1" style={{ margin: 0 }}>
            <ImageIcon size={20} /> Property Gallery
          </h3>
          {canEditOrDelete && (
            <Link to={`/listing-images?pgListingId=${pg.id}`} className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
              <Plus size={14} /> Upload Custom Photo
            </Link>
          )}
        </div>
        <div className="grid-3">
          {displayPhotos.map((img) => (
            <div key={img.id} className={styles.card} style={{ padding: '0.5rem' }}>
              <img
                src={getImageUrl(img.imageUrl)}
                alt={img.imageName || 'Property Gallery Photo'}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
                onError={(e) => {
                  e.target.src = DEFAULT_ROOM_IMAGE;
                }}
              />
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>
                {img.imageName || `Image #${img.id}`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="d-flex justify-between align-center" style={{ marginBottom: '1rem' }}>
          <h3 className="d-flex align-center gap-1" style={{ margin: 0 }}>
            <Sparkles size={20} /> Property Amenities
          </h3>
          {canEditOrDelete && (
            <Link to={`/amenities?pgListingId=${pg.id}`} className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
              <Plus size={14} /> Add Amenity
            </Link>
          )}
        </div>
        {amenities.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No amenities listed for this PG.</p>
        ) : (
          <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
            {amenities.map((a) => (
              <span
                key={a.id}
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  border: '1px solid var(--border-color)',
                }}
              >
                ✓ {a.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Rooms Inventory Section */}
      <div>
        <div className="d-flex justify-between align-center" style={{ marginBottom: '1rem' }}>
          <h3 className="d-flex align-center gap-1" style={{ margin: 0 }}>
            <BedDouble size={20} /> Available Rooms & Beds
          </h3>
          {canEditOrDelete && (
            <Link to={`/rooms?pgListingId=${pg.id}`} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>
              <Plus size={14} /> Add Room
            </Link>
          )}
        </div>
        {rooms.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No rooms configured for this PG listing.</p>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Room No.</th>
                  <th>Floor</th>
                  <th>Sharing Type</th>
                  <th>Gender Preference</th>
                  <th>Price / Month</th>
                  <th>Beds Available</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>Room #{r.roomNumber}</strong>
                    </td>
                    <td>Floor {r.floorNumber}</td>
                    <td>{formatEnumValue(r.sharingType)}</td>
                    <td>{formatEnumValue(r.genderPreference)}</td>
                    <td>
                      <strong>{formatCurrency(r.pricePerMonth)}</strong>
                    </td>
                    <td>
                      <Badge status={r.availableBeds > 0 ? 'ACTIVE' : 'INACTIVE'}>
                        {r.availableBeds} / {r.totalBeds} Available
                      </Badge>
                    </td>
                    <td>
                      {r.availableBeds <= 0 ? (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full</span>
                      ) : isCustomer ? (
                        <Link
                          to={`/bookings?roomId=${r.id}`}
                          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
                        >
                          Book Bed
                        </Link>
                      ) : (isOwner || isAdmin) ? (
                        <Link
                          to={`/rooms?pgListingId=${pg.id}`}
                          className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                        >
                          <Settings size={14} /> Manage Room
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                        >
                          Log in to book
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete PG Listing"
        message="Are you sure you want to delete this PG listing? All associated rooms and amenities will be deleted."
        onConfirm={handleDeletePg}
        onCancel={() => setDeleteModalOpen(false)}
        loading={actionLoading}
      />
    </div>
  );
};
