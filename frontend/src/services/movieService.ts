import movieApi from './movie.api';
import type { ApiResponse, Movie, Category, MovieRequest } from '../types';

export const movieService = {
  getAllMovies: async (): Promise<ApiResponse<Movie[]>> => {
    return await movieApi.get<ApiResponse<Movie[]>>('/movies');
  },

  getMovieById: async (id: number): Promise<ApiResponse<Movie>> => {
    return await movieApi.get<ApiResponse<Movie>>(`/movies/${id}`);
  },

  getMoviesByCategory: async (categoryId: number): Promise<ApiResponse<Movie[]>> => {
    return await movieApi.get<ApiResponse<Movie[]>>(`/movies/category/${categoryId}`);
  },

  createMovie: async (data: MovieRequest): Promise<ApiResponse<Movie>> => {
    return await movieApi.post<ApiResponse<Movie>>('/movies', data);
  },

  updateMovie: async (id: number, data: MovieRequest): Promise<ApiResponse<Movie>> => {
    return await movieApi.put<ApiResponse<Movie>>(`/movies/${id}`, data);
  },

  deleteMovie: async (id: number): Promise<ApiResponse<void>> => {
    return await movieApi.delete<ApiResponse<void>>(`/movies/${id}`);
  },

  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    return await movieApi.get<ApiResponse<Category[]>>('/categories');
  },
};
