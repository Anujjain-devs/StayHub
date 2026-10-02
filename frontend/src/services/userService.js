import apiClient from '../api/apiClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const userService = {
  // POST /api/users/register (Public)
  register(userRequestDto) {
    return apiClient.post(API_ROUTES.USERS.REGISTER, userRequestDto);
  },

  // GET /api/users (ROLE_ADMIN)
  getAll() {
    return apiClient.get(API_ROUTES.USERS.BASE);
  },

  // GET /api/users/{id} (ROLE_ADMIN)
  getById(id) {
    return apiClient.get(API_ROUTES.USERS.BY_ID(id));
  },

  // PUT /api/users/{id} (ROLE_ADMIN)
  update(id, userRequestDto) {
    return apiClient.put(API_ROUTES.USERS.BY_ID(id), userRequestDto);
  },

  // DELETE /api/users/{id} (ROLE_ADMIN)
  delete(id) {
    return apiClient.delete(API_ROUTES.USERS.BY_ID(id));
  },
};
