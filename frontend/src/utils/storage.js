const TOKEN_KEY = 'stayhub_token';
const USER_KEY = 'stayhub_user';

export const storage = {
  // Store authentication details directly returned by POST /auth/login
  setAuth(data) {
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    const user = {
      userId: data.userId,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
