export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
  },
  USERS: {
    REGISTER: '/api/users/register',
    BASE: '/api/users',
    BY_ID: (id) => `/api/users/${id}`,
  },
  PG_LISTINGS: {
    BASE: '/api/pg-listings',
    BY_ID: (id) => `/api/pg-listings/${id}`,
    BY_OWNER: (ownerId) => `/api/pg-listings/owner/${ownerId}`,
    SEARCH_CITY: '/api/pg-listings/search/city',
    SEARCH_GENDER: '/api/pg-listings/search/gender',
    SEARCH_SHARING: '/api/pg-listings/search/sharing',
    SEARCH_PRICE: '/api/pg-listings/search/price',
  },
  ROOMS: {
    BASE: '/api/rooms',
    BY_ID: (id) => `/api/rooms/${id}`,
    BY_PG: (pgListingId) => `/api/rooms/pg/${pgListingId}`,
  },
  AMENITIES: {
    BASE: '/api/amenities',
    BY_ID: (id) => `/api/amenities/${id}`,
    BY_PG: (pgListingId) => `/api/amenities/pg/${pgListingId}`,
  },
  BOOKINGS: {
    BASE: '/api/bookings',
    BY_ID: (id) => `/api/bookings/${id}`,
    BY_CUSTOMER: (customerId) => `/api/bookings/customer/${customerId}`,
  },
  LISTING_IMAGES: {
    BASE: '/api/listing-images',
    BY_ID: (id) => `/api/listing-images/${id}`,
    BY_PG: (pgListingId) => `/api/listing-images/pg/${pgListingId}`,
    UPLOAD: (pgId) => `/api/listing-images/upload/${pgId}`,
  },
  PAYMENTS: {
    BASE: '/api/payments',
    CREATE_ORDER: '/api/payments/create-order',
    VERIFY: '/api/payments/verify',
    BY_ID: (id) => `/api/payments/${id}`,
    BY_BOOKING: (bookingId) => `/api/payments/booking/${bookingId}`,
  },
};
