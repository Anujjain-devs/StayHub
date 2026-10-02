import apiClient from '../api/apiClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const bookingService = {
  // POST /api/bookings
  create(bookingRequestDto) {
    return apiClient.post(API_ROUTES.BOOKINGS.BASE, bookingRequestDto);
  },

  // GET /api/bookings
  getAll() {
    return apiClient.get(API_ROUTES.BOOKINGS.BASE);
  },

  // GET /api/bookings/{id}
  getById(id) {
    return apiClient.get(API_ROUTES.BOOKINGS.BY_ID(id));
  },

  // PUT /api/bookings/{id}
  update(id, bookingRequestDto) {
    return apiClient.put(API_ROUTES.BOOKINGS.BY_ID(id), bookingRequestDto);
  },

  // DELETE /api/bookings/{id}
  delete(id) {
    return apiClient.delete(API_ROUTES.BOOKINGS.BY_ID(id));
  },

  // GET /api/bookings/customer/{customerId}
  getByCustomer(customerId) {
    return apiClient.get(API_ROUTES.BOOKINGS.BY_CUSTOMER(customerId));
  },
};
