import type { LoginRequest, RegisterRequest, AuthResponse, ApiResponse, UserResponse } from '../types';

import userApi from './user.api';

export const authService = {
  login: async (request: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return await userApi.post<ApiResponse<AuthResponse>>('/auth/login', request);
  },

  register: async (request: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return await userApi.post<ApiResponse<AuthResponse>>('/auth/register', request);
  },

  getCurrentUser: async (): Promise<ApiResponse<UserResponse>> => {
    return await userApi.get<ApiResponse<UserResponse>>('/users/me');
  },


  logout: async (): Promise<void> => {
    // Some backends might want a logout call, if so:
    // await userApi.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
