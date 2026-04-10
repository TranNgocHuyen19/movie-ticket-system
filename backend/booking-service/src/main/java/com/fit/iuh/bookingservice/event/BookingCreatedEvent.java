package com.fit.iuh.bookingservice.event;

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
public class BookingCreatedEvent {
    @Builder.Default
    private String eventType = "BOOKING_CREATED";
    private String bookingId;
    private Long movieId;
    private String movieTitle;
    private Long userId;
    private List<String> seats;
    private LocalDateTime createdAt;
}