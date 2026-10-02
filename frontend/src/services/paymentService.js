import apiClient from '../api/apiClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const paymentService = {
  // POST /api/payments/create-order -> { bookingId }
  createOrder(paymentRequestDto) {
    return apiClient.post(API_ROUTES.PAYMENTS.CREATE_ORDER, paymentRequestDto);
  },

  // POST /api/payments/verify -> { razorpayOrderId, razorpayPaymentId, razorpaySignature }
  verifyPayment(paymentVerifyRequestDto) {
    return apiClient.post(API_ROUTES.PAYMENTS.VERIFY, paymentVerifyRequestDto);
  },

  // GET /api/payments
  getAll() {
    return apiClient.get(API_ROUTES.PAYMENTS.BASE);
  },

  // GET /api/payments/{id}
  getById(id) {
    return apiClient.get(API_ROUTES.PAYMENTS.BY_ID(id));
  },

  // GET /api/payments/booking/{bookingId}
  getByBooking(bookingId) {
    return apiClient.get(API_ROUTES.PAYMENTS.BY_BOOKING(bookingId));
  },

  // DELETE /api/payments/{id}
  delete(id) {
    return apiClient.delete(API_ROUTES.PAYMENTS.BY_ID(id));
  },
};
