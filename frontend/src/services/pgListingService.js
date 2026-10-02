import apiClient from '../api/apiClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const pgListingService = {
  // POST /api/pg-listings
  create(pgListingRequestDto) {
    return apiClient.post(API_ROUTES.PG_LISTINGS.BASE, pgListingRequestDto);
  },

  // GET /api/pg-listings
  getAll() {
    return apiClient.get(API_ROUTES.PG_LISTINGS.BASE);
  },

  // GET /api/pg-listings/{id}
  getById(id) {
    return apiClient.get(API_ROUTES.PG_LISTINGS.BY_ID(id));
  },

  // PUT /api/pg-listings/{id}
  update(id, pgListingRequestDto) {
    return apiClient.put(API_ROUTES.PG_LISTINGS.BY_ID(id), pgListingRequestDto);
  },

  // DELETE /api/pg-listings/{id}
  delete(id) {
    return apiClient.delete(API_ROUTES.PG_LISTINGS.BY_ID(id));
  },

  // GET /api/pg-listings/owner/{ownerId}
  getByOwner(ownerId) {
    return apiClient.get(API_ROUTES.PG_LISTINGS.BY_OWNER(ownerId));
  },

  // GET /api/pg-listings/search/city?city=...
  searchByCity(city) {
    return apiClient.get(API_ROUTES.PG_LISTINGS.SEARCH_CITY, { params: { city } });
  },

  // GET /api/pg-listings/search/gender?genderPreference=...
  searchByGender(genderPreference) {
    return apiClient.get(API_ROUTES.PG_LISTINGS.SEARCH_GENDER, { params: { genderPreference } });
  },

  // GET /api/pg-listings/search/sharing?sharingType=...
  searchBySharing(sharingType) {
    return apiClient.get(API_ROUTES.PG_LISTINGS.SEARCH_SHARING, { params: { sharingType } });
  },

  // GET /api/pg-listings/search/price?minPrice=...&maxPrice=...
  searchByPrice(minPrice, maxPrice) {
    return apiClient.get(API_ROUTES.PG_LISTINGS.SEARCH_PRICE, { params: { minPrice, maxPrice } });
  },
};
