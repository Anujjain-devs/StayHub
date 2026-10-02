import apiClient from '../api/apiClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const roomService = {
  // POST /api/rooms
  create(roomRequestDto) {
    return apiClient.post(API_ROUTES.ROOMS.BASE, roomRequestDto);
  },

  // GET /api/rooms
  getAll() {
    return apiClient.get(API_ROUTES.ROOMS.BASE);
  },

  // GET /api/rooms/{id}
  getById(id) {
    return apiClient.get(API_ROUTES.ROOMS.BY_ID(id));
  },

  // PUT /api/rooms/{id}
  update(id, roomRequestDto) {
    return apiClient.put(API_ROUTES.ROOMS.BY_ID(id), roomRequestDto);
  },

  // DELETE /api/rooms/{id}
  delete(id) {
    return apiClient.delete(API_ROUTES.ROOMS.BY_ID(id));
  },

  // GET /api/rooms/pg/{pgListingId}
  getByPgListing(pgListingId) {
    return apiClient.get(API_ROUTES.ROOMS.BY_PG(pgListingId));
  },
};
