import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { pgListingService } from '../../services/pgListingService';
import { listingImageService } from '../../services/listingImageService';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getPgPhotos } from '../../utils/dummyPhotos';
import {
  Building,
  MapPin,
  ShieldCheck,
  Search,
  BedDouble,
  Sparkles,
  Users,
  CheckCircle2,
  Smile,
  Eye,
  PlusCircle,
  ArrowRight,
  Star,
  Lock,
  Compass,
} from 'lucide-react';
import styles from './HomePage.module.css';
import commonStyles from '../../components/common/Common.module.css';

export const HomePage = () => {
  const [pgListings, setPgListings] = useState([]);
  const [pgImages, setPgImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchGender, setSearchGender] = useState('');
  const [searchSharing, setSearchSharing] = useState('');

  const { isAuthenticated, isOwner } = useAuth();
  const navigate = useNavigate();

  const loadListings = async () => {
    try {
      setLoading(true);
      const data = await pgListingService.getAll();
      const listings = data || [];
      setPgListings(listings);

      // Fetch sample preview image for each PG
      const imageMap = {};
      for (const pg of listings) {
        try {
          const imgs = await listingImageService.getByPgListing(pg.id);
          if (imgs && imgs.length > 0) {
            imageMap[pg.id] = imgs[0].imageUrl;
          }
        } catch (e) {
          // fallback
        }
      }
      setPgImages(imageMap);
    } catch (err) {
      console.error('Error fetching home listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/pg-listings' } } });
      return;
    }
    try {
      setLoading(true);
      let results = [];
      if (searchCity.trim()) {
        results = await pgListingService.searchByCity(searchCity.trim());
      } else {
        results = await pgListingService.getAll();
      }
      setPgListings(results || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Sparkles size={16} color="#fbbf24" /> StayHub Premium Accommodation Network
          </div>
          <h1 className={styles.heroTitle}>Find Your Perfect PG Accommodation</h1>
          <p className={styles.heroSubtitle}>
            Safe, comfortable, and fully-equipped Paying Guest accommodations for students and working professionals across top cities.
          </p>

          <div className={styles.heroButtons}>
            <Link to="/pg-listings" className={styles.btnHeroPrimary}>
              Explore PGs <ArrowRight size={18} />
            </Link>
            {isAuthenticated && isOwner ? (
              <Link to="/pg-listings/new" className={styles.btnHeroSecondary}>
                <PlusCircle size={18} /> Add Your PG
              </Link>
            ) : (
              <Link to="/register" className={styles.btnHeroSecondary}>
                Register Your PG
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 2. QUICK SEARCH BAR */}
      <div className={styles.searchContainer}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <div className={styles.searchGroup}>
            <label className={styles.searchLabel}>
              <MapPin size={16} color="var(--primary)" /> City / Location
            </label>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="e.g. Pune, Mumbai, Bangalore"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>

          <div className={styles.searchGroup}>
            <label className={styles.searchLabel}>
              <Users size={16} color="var(--primary)" /> Gender Preference
            </label>
            <select
              className={styles.searchSelect}
              value={searchGender}
              onChange={(e) => setSearchGender(e.target.value)}
            >
              <option value="">Any Preference</option>
              <option value="MALE">Male Only</option>
              <option value="FEMALE">Female Only</option>
              <option value="UNISEX">Unisex / Co-ed</option>
            </select>
          </div>

          <div className={styles.searchGroup}>
            <label className={styles.searchLabel}>
              <BedDouble size={16} color="var(--primary)" /> Room Sharing
            </label>
            <select
              className={styles.searchSelect}
              value={searchSharing}
              onChange={(e) => setSearchSharing(e.target.value)}
            >
              <option value="">Any Sharing</option>
              <option value="SINGLE">Single Occupancy</option>
              <option value="DOUBLE">Double Sharing</option>
              <option value="TRIPLE">Triple Sharing</option>
              <option value="FOUR_SHARING">Four Sharing</option>
            </select>
          </div>

          <button type="submit" className={styles.searchBtn}>
            <Search size={18} /> Search PGs
          </button>
        </form>
      </div>

      {/* 3. FEATURED STATISTICS */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Building size={28} />
          </div>
          <div>
            <div className={styles.statNumber}>{pgListings.length > 0 ? `${pgListings.length}+` : '50+'}</div>
            <div className={styles.statLabel}>Verified PG Properties</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'var(--success-light)', color: '#065f46' }}>
            <MapPin size={28} />
          </div>
          <div>
            <div className={styles.statNumber}>15+</div>
            <div className={styles.statLabel}>Major Tech Cities</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'var(--info-light)', color: '#1e40af' }}>
            <Smile size={28} />
          </div>
          <div>
            <div className={styles.statNumber}>2,400+</div>
            <div className={styles.statLabel}>Happy Residents</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'var(--warning-light)', color: '#92400e' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <div className={styles.statNumber}>100%</div>
            <div className={styles.statLabel}>Owner Verified Listings</div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE STAYHUB */}
      <section style={{ marginBottom: '5rem' }}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Why StayHub</span>
          <h2 className={styles.sectionTitle}>Everything You Need for a Seamless Stay</h2>
          <p className={styles.sectionSubtitle}>
            We eliminate the hassle of PG hunting by connecting tenants directly with verified PG owners.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <ShieldCheck size={24} />
            </div>
            <h3 className={styles.featureTitle}>Verified PG Listings</h3>
            <p className={styles.featureDesc}>
              Every PG listing is physically inspected and verified for safety, amenities, and accurate room details.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <CheckCircle2 size={24} />
            </div>
            <h3 className={styles.featureTitle}>Easy Online Booking</h3>
            <p className={styles.featureDesc}>
              Reserve room beds directly online in seconds with transparent availability and check-in confirmation.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Sparkles size={24} />
            </div>
            <h3 className={styles.featureTitle}>Affordable & Transparent Pricing</h3>
            <p className={styles.featureDesc}>
              No hidden brokerage fees or surprise charges. What you see is what you pay.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Lock size={24} />
            </div>
            <h3 className={styles.featureTitle}>Secure Environment</h3>
            <p className={styles.featureDesc}>
              Choose from gender-specific accommodations (Male, Female, Unisex) with 24/7 security.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Users size={24} />
            </div>
            <h3 className={styles.featureTitle}>Direct Owner Contact</h3>
            <p className={styles.featureDesc}>
              Communicate directly with registered PG owners without third-party middlemen.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Compass size={24} />
            </div>
            <h3 className={styles.featureTitle}>Fast & Smart Search</h3>
            <p className={styles.featureDesc}>
              Filter by location, price, gender, and sharing type to find your ideal home away from home.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PG LISTINGS */}
      <section style={{ marginBottom: '5rem' }}>
        <div className="d-flex justify-between align-center" style={{ marginBottom: '2rem' }}>
          <div>
            <span className={styles.sectionTag}>Featured Accommodations</span>
            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
              Top PG Listings Near You
            </h2>
          </div>
          <Link to="/pg-listings" className={`${commonStyles.btn} ${commonStyles.btnSecondary}`}>
            View All PGs <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching top accommodations..." />
        ) : pgListings.length === 0 ? (
          <div className={styles.emptyContainer}>
            <div className={styles.emptyIconBg}>
              <Building size={36} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No PG Listings Available Yet
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Be the first PG Owner to list your property on StayHub and reach thousands of student and professional tenants!
            </p>
            {isOwner ? (
              <Link to="/pg-listings/new" className={`${commonStyles.btn} ${commonStyles.btnPrimary}`}>
                <PlusCircle size={18} /> Add Your First PG Listing
              </Link>
            ) : (
              <Link to="/register" className={`${commonStyles.btn} ${commonStyles.btnPrimary}`}>
                Register as PG Owner
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.listingsGrid}>
            {pgListings.slice(0, 6).map((pg) => {
              const coverImg = pgImages[pg.id] || getPgPhotos(pg.id)[0].imageUrl;

              return (
                <div key={pg.id} className={styles.pgCard}>
                  <div className={styles.pgImageContainer}>
                    <img
                      src={coverImg}
                      alt={pg.pgName}
                      className={styles.pgImage}
                      onError={(e) => {
                        e.target.src = getPgPhotos(pg.id)[0].imageUrl;
                      }}
                    />
                    <div className={styles.pgBadge}>
                      <Badge status={pg.status}>{pg.status}</Badge>
                    </div>
                  </div>

                  <div className={styles.pgBody}>
                    <h3 className={styles.pgTitle}>{pg.pgName}</h3>
                    <div className={styles.pgLocation}>
                      <MapPin size={16} color="var(--primary)" /> {pg.city}, {pg.state} - {pg.pincode}
                    </div>
                    <p className={styles.pgDesc}>{pg.description}</p>

                    <div className={styles.pgFooter}>
                      <div>
                        <small style={{ color: 'var(--text-muted)', display: 'block' }}>Address</small>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          {pg.address.length > 25 ? `${pg.address.slice(0, 25)}...` : pg.address}
                        </strong>
                      </div>
                      <Link
                        to={`/pg-listings/${pg.id}`}
                        className={`${commonStyles.btn} ${commonStyles.btnPrimary} ${commonStyles.btnSm}`}
                      >
                        <Eye size={14} /> View PG
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. HOW IT WORKS */}
      <section style={{ marginBottom: '5rem' }}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Simple Workflow</span>
          <h2 className={styles.sectionTitle}>How StayHub Works</h2>
          <p className={styles.sectionSubtitle}>Book your ideal PG room in 3 easy steps</p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepBadge}>1</div>
            <h3 className={styles.stepTitle}>Explore & Search</h3>
            <p className={styles.stepDesc}>
              Search PG accommodations by location, price budget, gender preference, and amenities.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepBadge}>2</div>
            <h3 className={styles.stepTitle}>Compare Rooms</h3>
            <p className={styles.stepDesc}>
              View room sharing options, bed availability count, monthly rent, and real property photos.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepBadge}>3</div>
            <h3 className={styles.stepTitle}>Book Online</h3>
            <p className={styles.stepDesc}>
              Instantly reserve your bed, confirm check-in dates, and process payment securely.
            </p>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section style={{ marginBottom: '5rem' }}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Tenant Feedback</span>
          <h2 className={styles.sectionTitle}>Loved by Students & Professionals</h2>
          <p className={styles.sectionSubtitle}>
            See what tenants have to say about their StayHub experience
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div>
              <div className="d-flex gap-1" style={{ marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className={styles.quoteText}>
                "Finding a PG near my college used to take days. With StayHub, I compared available beds and booked my room within 10 minutes!"
              </p>
            </div>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>AS</div>
              <div>
                <div className={styles.userName}>Aarav Sharma</div>
                <div className={styles.userRole}>CDAC DAC Student • Pune</div>
              </div>
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <div>
              <div className="d-flex gap-1" style={{ marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className={styles.quoteText}>
                "As a female professional moving to a new city, safety was my priority. StayHub's verified female PGs gave me complete peace of mind."
              </p>
            </div>
            <div className={styles.userInfo}>
              <div className={styles.avatar} style={{ backgroundColor: '#ec4899' }}>
                VP
              </div>
              <div>
                <div className={styles.userName}>Ananya Patel</div>
                <div className={styles.userRole}>Software Engineer • Bangalore</div>
              </div>
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <div>
              <div className="d-flex gap-1" style={{ marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className={styles.quoteText}>
                "Listing my PG property on StayHub filled all my available beds in less than two weeks. Managing bookings is super smooth."
              </p>
            </div>
            <div className={styles.userInfo}>
              <div className={styles.avatar} style={{ backgroundColor: '#10b981' }}>
                RK
              </div>
              <div>
                <div className={styles.userName}>Rajesh Kulkarni</div>
                <div className={styles.userRole}>PG Property Owner • Mumbai</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
