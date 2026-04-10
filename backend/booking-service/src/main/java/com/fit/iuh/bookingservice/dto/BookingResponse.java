package com.fit.iuh.bookingservice.dto;

import com.fit.iuh.bookingservice.entity.Booking;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private String id;
    private Long movieId;
    private String movieTitle;
    private Long userId;
    private List<String> seats;
    private String status;
    private LocalDateTime createdAt;

    public static BookingResponse fromEntity(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .movieId(booking.getMovieId())
                .movieTitle(booking.getMovieTitle())
                .userId(booking.getUserId())
                .seats(booking.getSeats())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}