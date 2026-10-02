import apiClient from '../api/apiClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const authService = {
  // POST /auth/login
  login(loginRequestDto) {
    return apiClient.post(API_ROUTES.AUTH.LOGIN, loginRequestDto);
  },
};
