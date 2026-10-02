import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { pgListingService } from '../../services/pgListingService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { TextInput } from '../../components/forms/TextInput';
import { TextArea } from '../../components/forms/TextArea';
import { SelectInput } from '../../components/forms/SelectInput';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { ArrowLeft } from 'lucide-react';
import styles from '../../components/common/Common.module.css';

export const PgFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pgName: '',
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    status: 'ACTIVE',
    ownerId: user?.userId || 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const loadPg = async () => {
        try {
          // GET /api/pg-listings/{id}
          const data = await pgListingService.getById(id);
          setFormData({
            pgName: data.pgName,
            description: data.description,
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            status: data.status,
            ownerId: data.ownerId,
          });
        } catch (err) {
          showToast(err.message, 'error');
        }
      };
      loadPg();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditMode) {
        // PUT /api/pg-listings/{id}
        await pgListingService.update(id, formData);
        showToast('PG Listing updated successfully!');
        navigate(`/pg-listings/${id}`);
      } else {
        // POST /api/pg-listings
        const newPg = await pgListingService.create({ ...formData, ownerId: user.userId });
        showToast('PG Listing created successfully! Now add rooms, amenities, and photos.');
        navigate(`/pg-listings/${newPg.id}`);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <Link to="/pg-listings" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16} /> Back to PG Listings
      </Link>

      <div className={styles.card}>
        <h2>{isEditMode ? 'Edit PG Listing' : 'Create New PG Listing'}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Fill in the property information below
        </p>

        <form onSubmit={handleSubmit}>
          <TextInput
            label="PG Property Name"
            name="pgName"
            value={formData.pgName}
            onChange={handleChange}
            placeholder="e.g. Royal Living PG for Men"
            required
          />

          <TextArea
            label="Property Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe amenities, location highlights, rules..."
            rows={4}
            required
          />

          <TextInput
            label="Full Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address, landmark"
            required
          />

          <div className="d-flex gap-2">
            <div style={{ flex: 1 }}>
              <TextInput
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <TextInput
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <TextInput
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                required
              />
            </div>
          </div>

          <SelectInput
            label="Listing Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { label: 'ACTIVE', value: 'ACTIVE' },
              { label: 'INACTIVE', value: 'INACTIVE' },
            ]}
            required
          />

          <SubmitButton loading={loading}>
            {isEditMode ? 'Update Listing' : 'Create Listing'}
          </SubmitButton>
        </form>
      </div>
    </div>
  );
};
