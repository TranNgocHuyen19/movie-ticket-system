package com.iuh.fit.movie_service.config;

import com.iuh.fit.movie_service.entity.Category;
import com.iuh.fit.movie_service.entity.Movie;
import com.iuh.fit.movie_service.repository.CategoryRepository;
import com.iuh.fit.movie_service.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final MovieRepository movieRepository;

    @Override
    public void run(String... args) {
        Category action = categoryRepository.save(Category.builder().name("Action").description("Action movies").build());
        Category comedy = categoryRepository.save(Category.builder().name("Comedy").description("Comedy movies").build());
        Category horror = categoryRepository.save(Category.builder().name("Horror").description("Horror movies").build());
        Category sciFi = categoryRepository.save(Category.builder().name("Sci-Fi").description("Science Fiction movies").build());

        movieRepository.save(Movie.builder().title("Avengers: Endgame").description("The Avengers assemble once more").duration(181).posterUrl("https://example.com/avengers.jpg").category(action).build());
        movieRepository.save(Movie.builder().title("John Wick 4").description("John Wick takes on his most lethal adversaries").duration(169).posterUrl("https://example.com/johnwick4.jpg").category(action).build());
        movieRepository.save(Movie.builder().title("The Hangover").description("Three friends wake up with no memory").duration(100).posterUrl("https://example.com/hangover.jpg").category(comedy).build());
        movieRepository.save(Movie.builder().title("Conjuring").description("Paranormal investigators fight evil").duration(112).posterUrl("https://example.com/conjuring.jpg").category(horror).build());
        movieRepository.save(Movie.builder().title("Interstellar").description("A team of explorers travel through a wormhole").duration(169).posterUrl("https://example.com/interstellar.jpg").category(sciFi).build());
    }
}
