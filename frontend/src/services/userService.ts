import userApi from './user.api';
import type { ApiResponse, UserResponse } from '../types';

export const userService = {
  getCurrentUser: async (): Promise<ApiResponse<UserResponse>> => {
    return await userApi.get<ApiResponse<UserResponse>>('/users/me');
  },

  getUserProfile: async (id: number): Promise<ApiResponse<UserResponse>> => {
    return await userApi.get<ApiResponse<UserResponse>>(`/users/${id}`);
  },

  updateProfile: async (id: number, data: any): Promise<ApiResponse<UserResponse>> => {
    return await userApi.put<ApiResponse<UserResponse>>(`/users/${id}`, data);
  },
};

