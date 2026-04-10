package com.iuh.fit.movie_service.service;

import com.iuh.fit.movie_service.dto.MovieRequest;
import com.iuh.fit.movie_service.dto.MovieResponse;
import com.iuh.fit.movie_service.entity.Category;
import com.iuh.fit.movie_service.entity.Movie;
import com.iuh.fit.movie_service.repository.CategoryRepository;
import com.iuh.fit.movie_service.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final CategoryRepository categoryRepository;

    public List<MovieResponse> getAllMovies() {
        return movieRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<MovieResponse> getMoviesByCategory(Long categoryId) {
        return movieRepository.findByCategoryId(categoryId).stream().map(this::toResponse).toList();
    }

    public MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
        return toResponse(movie);
    }

    public MovieResponse createMovie(MovieRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        Movie movie = Movie.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .duration(request.getDuration())
                .posterUrl(request.getPosterUrl())
                .category(category)
                .build();

        return toResponse(movieRepository.save(movie));
    }

    public MovieResponse updateMovie(Long id, MovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setDuration(request.getDuration());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setCategory(category);

        return toResponse(movieRepository.save(movie));
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }

    private MovieResponse toResponse(Movie movie) {
        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .duration(movie.getDuration())
                .posterUrl(movie.getPosterUrl())
                .categoryId(movie.getCategory() != null ? movie.getCategory().getId() : null)
                .categoryName(movie.getCategory() != null ? movie.getCategory().getName() : null)
                .build();
    }
}
