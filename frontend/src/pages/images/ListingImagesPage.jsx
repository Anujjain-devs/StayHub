import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listingImageService } from '../../services/listingImageService';
import { pgListingService } from '../../services/pgListingService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { SelectInput } from '../../components/forms/SelectInput';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import styles from '../../components/common/Common.module.css';

const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80';

const getImageUrl = (url) => {
  if (!url) return DEFAULT_ROOM_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return url;
};

export const ListingImagesPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedPgId = searchParams.get('pgListingId');

  const [images, setImages] = useState([]);
  const [pgListings, setPgListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(Boolean(preselectedPgId));
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPgId, setSelectedPgId] = useState(preselectedPgId || '');
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { user, isOwner, isAdmin } = useAuth();
  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const rawImgData = await listingImageService.getAll();
      const imgData = Array.isArray(rawImgData) ? rawImgData : [];

      let rawPgData = [];
      if (isOwner && user?.userId) {
        // Owner: Fetch owner's PG listings ONLY
        rawPgData = await pgListingService.getByOwner(user.userId);
      } else {
        // Admin: Fetch all PG listings
        rawPgData = await pgListingService.getAll();
      }
      const pgData = Array.isArray(rawPgData) ? rawPgData : [];

      setPgListings(pgData);

      if (isOwner && user?.userId) {
        // Owner: Filter images to show ONLY images belonging to owner's PG properties
        const ownerPgIds = new Set(pgData.filter(Boolean).map((p) => Number(p.id)));
        const ownerImages = imgData.filter((img) => img && ownerPgIds.has(Number(img.pgListingId)));
        setImages(ownerImages);
      } else {
        setImages(imgData);
      }

      if (pgData.length > 0 && !preselectedPgId) {
        setSelectedPgId(pgData[0].id);
      }
    } catch (err) {
      console.error('Error loading listing images:', err);
      showToast(err?.message || 'Error loading listing images', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast('Please select an image file to upload.', 'error');
      return;
    }
    if (!selectedPgId) {
      showToast('Please select a target PG Property.', 'error');
      return;
    }

    try {
      setActionLoading(true);
      // POST /api/listing-images/upload/{pgId} via multipart/form-data
      await listingImageService.upload(selectedPgId, selectedFile);
      showToast('Image uploaded successfully!');
      setShowForm(false);
      setSelectedFile(null);
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
      // DELETE /api/listing-images/{id}
      await listingImageService.delete(deleteTargetId);
      showToast('Image deleted successfully');
      setDeleteTargetId(null);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const pgMap = (Array.isArray(pgListings) ? pgListings : []).filter(Boolean).reduce((acc, p) => {
    if (p && p.id) {
      acc[p.id] = p;
    }
    return acc;
  }, {});

  if (loading) return <LoadingSpinner text="Loading listing images..." />;

  return (
    <div>
      <div className="d-flex justify-between align-center" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>Listing Gallery Images</h2>
          <p style={{ color: 'var(--text-muted)' }}>Upload and manage property photos for PG listings</p>
        </div>
        {(isOwner || isAdmin) && (
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} /> {showForm ? 'Close Form' : 'Upload Image'}
          </button>
        )}
      </div>

      {showForm && (
        <div className={styles.card} style={{ marginBottom: '2rem' }}>
          <h3>Upload Property Photo</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <SelectInput
              label="Select Target PG Property"
              name="pgListingId"
              value={selectedPgId}
              onChange={(e) => setSelectedPgId(e.target.value)}
              options={(Array.isArray(pgListings) ? pgListings : [])
                .filter(Boolean)
                .map((p) => ({ label: `${p.pgName || 'PG'} (${p.city || ''})`, value: p.id }))}
              required
            />

            <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
              <label className={styles.label}>
                Select Image File <span className={styles.required}>*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.input}
                required
              />
              <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Supported formats: PNG, JPG, JPEG, WEBP.
              </small>
            </div>

            <div className="d-flex gap-2" style={{ marginTop: '1rem' }}>
              <SubmitButton loading={actionLoading}>
                <Upload size={16} /> Upload Photo
              </SubmitButton>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => {
                  setShowForm(false);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {images.length === 0 ? (
        <EmptyState
          title="No Images Uploaded"
          description="There are currently no property images uploaded."
          icon={ImageIcon}
        />
      ) : (
        <div className="grid-3">
          {images.map((img) => (
            <div key={img.id} className={styles.card} style={{ padding: '0.5rem' }}>
              <img
                src={getImageUrl(img.imageUrl)}
                alt={img.imageName || 'PG Photo'}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
                onError={(e) => {
                  e.target.src = DEFAULT_ROOM_IMAGE;
                }}
              />

              <div className="d-flex justify-between align-center" style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>{img.imageName || `Image #${img.id}`}</strong>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {pgMap[img.pgListingId]?.pgName || `PG #${img.pgListingId}`}
                  </p>
                </div>

                {(isOwner || isAdmin) && (
                  <button
                    className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                    onClick={() => setDeleteTargetId(img.id)}
                    title="Delete Image"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Image"
        message="Are you sure you want to remove this property image?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
        loading={actionLoading}
      />
    </div>
  );
};
