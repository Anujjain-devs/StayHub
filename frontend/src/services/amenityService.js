import apiClient from '../api/apiClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const amenityService = {
  // POST /api/amenities
  create(amenityRequestDto) {
    return apiClient.post(API_ROUTES.AMENITIES.BASE, amenityRequestDto);
  },

  // GET /api/amenities
  getAll() {
    return apiClient.get(API_ROUTES.AMENITIES.BASE);
  },

  // GET /api/amenities/{id}
  getById(id) {
    return apiClient.get(API_ROUTES.AMENITIES.BY_ID(id));
  },

  // PUT /api/amenities/{id}
  update(id, amenityRequestDto) {
    return apiClient.put(API_ROUTES.AMENITIES.BY_ID(id), amenityRequestDto);
  },

  // DELETE /api/amenities/{id}
  delete(id) {
    return apiClient.delete(API_ROUTES.AMENITIES.BY_ID(id));
  },

  // GET /api/amenities/pg/{pgListingId}
  getByPgListing(pgListingId) {
    return apiClient.get(API_ROUTES.AMENITIES.BY_PG(pgListingId));
  },
};
