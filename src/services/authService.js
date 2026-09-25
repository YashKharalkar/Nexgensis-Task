import axiosClient from '@/api/axiosClient';

export const authService = {
  login: async (username, password) => {
    const response = await axiosClient.post('/auth/login', {
      username: username.trim(),
      password: password.trim(),
      expiresInMins: 120,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },
};
