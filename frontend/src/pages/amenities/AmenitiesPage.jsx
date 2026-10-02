import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { amenityService } from '../../services/amenityService';
import { pgListingService } from '../../services/pgListingService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { SelectInput } from '../../components/forms/SelectInput';
import { Plus, Trash2, Edit, Sparkles, Check, X } from 'lucide-react';
import styles from '../../components/common/Common.module.css';

const PRESET_AMENITIES = [
  'WiFi',
  'Parking',
  'CCTV',
  'Laundry',
  'Lift',
  'Power Backup',
  'RO Water',
  'Mess Facility',
  'Gym',
  'Security',
  'Housekeeping',
  'Air Conditioning',
  'Refrigerator',
  'TV',
  'Geyser / Hot Water',
];

export const AmenitiesPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedPgId = searchParams.get('pgListingId');

  const [amenities, setAmenities] = useState([]);
  const [pgListings, setPgListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { isOwner, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    pgListingId: preselectedPgId || '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const amenityData = await amenityService.getAll();
      const pgData = await pgListingService.getAll();
      setAmenities(amenityData || []);
      setPgListings(pgData || []);
      if (pgData && pgData.length > 0 && !preselectedPgId) {
        setFormData((prev) => ({ ...prev, pgListingId: pgData[0].id }));
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuickAddPreset = async (presetName) => {
    if (!formData.pgListingId) {
      showToast('Please select a target PG Property first.', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        name: presetName,
        pgListingId: Number(formData.pgListingId),
      };
      // POST /api/amenities
      await amenityService.create(payload);
      showToast(`Added '${presetName}' to selected PG property!`);
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
      // DELETE /api/amenities/{id}
      await amenityService.delete(deleteTargetId);
      showToast('Amenity deleted successfully');
      setDeleteTargetId(null);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openEdit = (a) => {
    setEditingAmenity(a);
    setFormData({
      name: a.name,
      pgListingId: a.pgListingId,
    });
    setShowForm(true);
  };

  const selectedPgObj = pgListings.find((p) => String(p.id) === String(formData.pgListingId));
  const existingAmenityNames = amenities
    .filter((a) => String(a.pgListingId) === String(formData.pgListingId))
    .map((a) => a.name.toLowerCase());

  if (loading) return <LoadingSpinner text="Loading amenities..." />;

  return (
    <div>
      <div className="d-flex justify-between align-center" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>Property Amenities</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage amenities assigned to PG accommodation properties</p>
        </div>
        {(isOwner || isAdmin) && (
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => {
              setEditingAmenity(null);
              setShowForm(!showForm);
            }}
          >
            <Plus size={18} /> {showForm ? 'Close Form' : 'Add Amenity'}
          </button>
        )}
      </div>

      {/* Main Amenity Management Card */}
      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Manage PG Property Amenities</h3>

        <SelectInput
          label="Select PG Property *"
          name="pgListingId"
          value={formData.pgListingId}
          onChange={handleChange}
          options={pgListings.map((p) => ({ label: `${p.pgName} (${p.city})`, value: p.id }))}
          required
        />

        {/* Currently Assigned Amenities for Selected PG */}
        {selectedPgObj && (
          <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <label className={styles.label} style={{ marginBottom: '0.75rem', display: 'block', fontWeight: 600 }}>
              Currently Assigned Amenities for <span style={{ color: 'var(--primary)' }}>{selectedPgObj.pgName}</span>:
            </label>
            {amenities.filter((a) => String(a.pgListingId) === String(formData.pgListingId)).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', italic: true }}>
                No amenities currently assigned to this property. Click any chip below to add.
              </p>
            ) : (
              <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
                {amenities
                  .filter((a) => String(a.pgListingId) === String(formData.pgListingId))
                  .map((a) => (
                    <span
                      key={a.id}
                      style={{
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Sparkles size={14} color="var(--primary)" /> {a.name}
                      {(isOwner || isAdmin) && (
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(a.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--danger)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0,
                            marginLeft: '2px',
                          }}
                          title={`Remove ${a.name}`}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Preset Chips for 1-Click Assignment */}
        {(isOwner || isAdmin) && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <label className={styles.label} style={{ marginBottom: '0.75rem', display: 'block', fontWeight: 600 }}>
              Click any amenity chip below to instantly add/assign it to {selectedPgObj?.pgName || 'selected PG'}:
            </label>
            <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
              {PRESET_AMENITIES.map((preset) => {
                const isAlreadyAdded = existingAmenityNames.includes(preset.toLowerCase());
                return (
                  <button
                    key={preset}
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleQuickAddPreset(preset)}
                    style={{
                      backgroundColor: isAlreadyAdded ? 'var(--bg-subtle)' : 'var(--bg-card)',
                      color: isAlreadyAdded ? 'var(--text-muted)' : 'var(--primary)',
                      border: isAlreadyAdded ? '1px solid var(--border-color)' : '1.5px solid var(--primary)',
                      padding: '8px 16px',
                      borderRadius: '24px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: isAlreadyAdded ? 'none' : 'var(--shadow-sm)',
                      transition: 'all 0.2s ease',
                    }}
                    title={isAlreadyAdded ? `Already assigned to ${selectedPgObj?.pgName}` : `Add ${preset}`}
                  >
                    {isAlreadyAdded ? <Check size={16} color="var(--text-muted)" /> : <Plus size={16} />}
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Amenity"
        message="Are you sure you want to remove this amenity?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
        loading={actionLoading}
      />
    </div>
  );
};
