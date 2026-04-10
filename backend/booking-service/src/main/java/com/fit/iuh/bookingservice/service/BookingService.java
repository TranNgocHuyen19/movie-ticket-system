package com.fit.iuh.bookingservice.service;

import com.fit.iuh.bookingservice.dto.BookingResponse;
import com.fit.iuh.bookingservice.dto.CreateBookingRequest;
import com.fit.iuh.bookingservice.entity.Booking;
import com.fit.iuh.bookingservice.event.BookingCreatedEvent;
import com.fit.iuh.bookingservice.event.BookingEventPublisher;
import com.fit.iuh.bookingservice.exception.NotFoundException;
import com.fit.iuh.bookingservice.integration.client.MovieServiceClient;
import com.fit.iuh.bookingservice.integration.client.UserServiceClient;
import com.fit.iuh.bookingservice.integration.dto.ExternalApiResponse;
import com.fit.iuh.bookingservice.integration.dto.MovieDto;
import com.fit.iuh.bookingservice.integration.dto.UserDto;
import com.fit.iuh.bookingservice.repository.BookingRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final MovieServiceClient movieServiceClient;
    private final UserServiceClient userServiceClient;
    private final BookingEventPublisher bookingEventPublisher;

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        log.info("Start creating booking: movieId={}, userId={}, seats={}",
            request.getMovieId(), request.getUserId(), request.getSeats());

        MovieDto movie = getMovieOrThrow(request.getMovieId());
        getUserOrThrow(request.getUserId());

        log.info("Validated movie and user successfully: movieId={}, movieTitle={}, userId={}",
            movie.getId(), movie.getTitle(), request.getUserId());

        Booking booking = Booking.builder()
                .movieId(movie.getId())
                .movieTitle(movie.getTitle())
                .userId(request.getUserId())
                .seats(request.getSeats())
                .status("CREATED")
                .build();

        Booking saved = bookingRepository.save(booking);

        log.info("Booking persisted: bookingId={}, status={}", saved.getId(), saved.getStatus());

        bookingEventPublisher.publishBookingCreated(
                BookingCreatedEvent.builder()
                        .bookingId(saved.getId())
                        .movieId(saved.getMovieId())
                        .movieTitle(saved.getMovieTitle())
                        .userId(saved.getUserId())
                        .seats(saved.getSeats())
                        .createdAt(saved.getCreatedAt())
                        .build()
        );

        log.info("Booking created flow finished: bookingId={}", saved.getId());

        return BookingResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(BookingResponse::fromEntity).toList();
    }

    private MovieDto getMovieOrThrow(Long movieId) {
        log.info("Calling movie-service to get movie: movieId={}", movieId);
        ExternalApiResponse<MovieDto> response = movieServiceClient.getById(movieId);
        if (response == null || response.getData() == null) {
            String upstreamMessage = response != null && response.getMessage() != null
                    ? response.getMessage()
                    : "movie-service returned empty payload";
            log.warn("movie-service did not return movie data: movieId={}, message={}", movieId, upstreamMessage);
            throw new NotFoundException("Movie not found (id=" + movieId + "): " + upstreamMessage);
        }
        log.info("movie-service returned movie successfully: movieId={}, title={}",
                response.getData().getId(), response.getData().getTitle());
        return response.getData();
    }

    private UserDto getUserOrThrow(Long userId) {
        log.info("Calling user-service to get user: userId={}", userId);
        ExternalApiResponse<UserDto> response = userServiceClient.getById(userId, extractAuthorizationHeader());
        if (response == null || response.getData() == null) {
            String upstreamMessage = response != null && response.getMessage() != null
                    ? response.getMessage()
                    : "user-service returned empty payload";
            log.warn("user-service did not return user data: userId={}, message={}", userId, upstreamMessage);
            throw new NotFoundException("User not found (id=" + userId + "): " + upstreamMessage);
        }
        log.info("user-service returned user successfully: userId={}, username={}",
                response.getData().getId(), response.getData().getUsername());
        return response.getData();
    }

    private String extractAuthorizationHeader() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return null;
        }
        HttpServletRequest request = attributes.getRequest();
        return request.getHeader("Authorization");
    }
}