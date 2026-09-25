import axiosClient from '@/api/axiosClient';

// Auth service functions to communicate with DummyJSON Auth API
export const authService = {
  // 1. Log in with username and password
  login: async (username, password) => {
    const response = await axiosClient.post('/auth/login', {
      username: username.trim(),
      password: password.trim(),
      expiresInMins: 120, // session duration
    });
    return response.data;
  },

  // 2. Get current authenticated user details using the saved token
  getCurrentUser: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },
};
