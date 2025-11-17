import apiClient from './api';
import type { LoginCredentials, AuthResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // If you have a logout endpoint, call it here
    // await apiClient.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    // If you have a get current user endpoint
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
