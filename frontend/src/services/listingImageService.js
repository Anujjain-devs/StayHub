import apiClient from '../api/apiClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const listingImageService = {
  // POST /api/listing-images/upload/{pgId} (Multipart file upload)
  upload(pgId, file) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(API_ROUTES.LISTING_IMAGES.UPLOAD(pgId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // GET /api/listing-images
  getAll() {
    return apiClient.get(API_ROUTES.LISTING_IMAGES.BASE);
  },

  // GET /api/listing-images/{id}
  getById(id) {
    return apiClient.get(API_ROUTES.LISTING_IMAGES.BY_ID(id));
  },

  // GET /api/listing-images/pg/{pgListingId}
  getByPgListing(pgListingId) {
    return apiClient.get(API_ROUTES.LISTING_IMAGES.BY_PG(pgListingId));
  },

  // DELETE /api/listing-images/{id}
  delete(id) {
    return apiClient.delete(API_ROUTES.LISTING_IMAGES.BY_ID(id));
  },
};
