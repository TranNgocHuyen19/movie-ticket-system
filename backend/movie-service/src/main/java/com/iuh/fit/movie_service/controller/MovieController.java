package com.iuh.fit.movie_service.controller;

import com.iuh.fit.movie_service.common.ApiResponse;
import com.iuh.fit.movie_service.dto.MovieRequest;
import com.iuh.fit.movie_service.dto.MovieResponse;
import com.iuh.fit.movie_service.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getAllMovies() {
        return ResponseEntity.ok(ApiResponse.success("Movies fetched", movieService.getAllMovies()));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getMoviesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(ApiResponse.success("Movies fetched by category", movieService.getMoviesByCategory(categoryId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Movie fetched", movieService.getMovieById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MovieResponse>> createMovie(@RequestBody MovieRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Movie created", movieService.createMovie(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> updateMovie(@PathVariable Long id, @RequestBody MovieRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Movie updated", movieService.updateMovie(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok(ApiResponse.success("Movie deleted", null));
    }
}
