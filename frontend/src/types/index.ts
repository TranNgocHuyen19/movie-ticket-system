export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  posterUrl: string;
  categoryId: number;
  categoryName?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface MovieRequest {
  title: string;
  description: string;
  duration: number;
  posterUrl: string;
  categoryId: number;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: UserResponse;
}

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password?: string;
}


export interface Booking {
  id: string;
  movieId: number;
  movieTitle: string;
  userId: number;
  seats: string[];
  status: string;
  createdAt: string;
}

export interface BookingRequest {
  movieId: number;
  userId: number;
  seats: string[];
}


export interface PaymentRequest {
  bookingId: string;
  amount: number;
  paymentMethod: string;
}

export interface PaymentResponse {
  bookingId: string;
  success: boolean;
  message: string;
}

