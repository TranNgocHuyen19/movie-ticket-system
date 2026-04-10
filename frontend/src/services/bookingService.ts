import bookingApi from './booking.api';
import type { ApiResponse, Booking, BookingRequest } from '../types';

export const bookingService = {
  createBooking: async (data: BookingRequest): Promise<ApiResponse<Booking>> => {
    return await bookingApi.post<ApiResponse<Booking>>('/bookings', data);
  },

  getAllBookings: async (): Promise<ApiResponse<Booking[]>> => {
    return await bookingApi.get<ApiResponse<Booking[]>>('/bookings');
  },
};

