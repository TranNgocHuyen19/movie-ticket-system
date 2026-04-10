package com.fit.iuh.bookingservice.integration.client;

import com.fit.iuh.bookingservice.integration.dto.CreateMovieRequest;
import com.fit.iuh.bookingservice.integration.dto.ExternalApiResponse;
import com.fit.iuh.bookingservice.integration.dto.MovieDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "movie-service", url = "${clients.movie-service.url}")
public interface MovieServiceClient {

    @GetMapping("/movies/{id}")
    ExternalApiResponse<MovieDto> getById(@PathVariable("id") Long id);

    @PostMapping("/movies")
    ExternalApiResponse<MovieDto> createMovie(@RequestBody CreateMovieRequest request);
}