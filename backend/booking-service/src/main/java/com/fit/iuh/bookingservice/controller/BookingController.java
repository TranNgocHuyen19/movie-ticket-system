package com.fit.iuh.bookingservice.controller;

import com.fit.iuh.bookingservice.common.ApiResponse;
import com.fit.iuh.bookingservice.dto.BookingResponse;
import com.fit.iuh.bookingservice.dto.CreateBookingRequest;
import com.fit.iuh.bookingservice.service.BookingService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        log.info("Received create booking request: movieId={}, userId={}, seats={}",
                request.getMovieId(), request.getUserId(), request.getSeats());
        BookingResponse response = bookingService.createBooking(request);
        log.info("Create booking request completed: bookingId={}", response.getId());
        return ResponseEntity.ok(ApiResponse.success("Booking created", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookings() {
        log.info("Received get bookings request");
        List<BookingResponse> response = bookingService.getAllBookings();
        log.info("Get bookings request completed: totalBookings={}", response.size());
        return ResponseEntity.ok(ApiResponse.success("Bookings fetched", response));
    }
}