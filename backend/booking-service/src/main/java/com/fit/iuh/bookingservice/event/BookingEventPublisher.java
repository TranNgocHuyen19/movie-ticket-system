package com.fit.iuh.bookingservice.event;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingEventPublisher {

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${booking.event.channel}")
    private String bookingEventChannel;

    public void publishBookingCreated(BookingCreatedEvent event) {
        try {
            log.info("Preparing BOOKING_CREATED event: bookingId={}, channel={}",
                    event.getBookingId(), bookingEventChannel);
            String payload = objectMapper.writeValueAsString(event);
            stringRedisTemplate.convertAndSend(bookingEventChannel, payload);
            log.info("Published BOOKING_CREATED event successfully: bookingId={}", event.getBookingId());
            log.debug("BOOKING_CREATED payload: {}", payload);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize BOOKING_CREATED event: bookingId={}", event.getBookingId(), e);
            throw new IllegalStateException("Cannot serialize BOOKING_CREATED event", e);
        }
    }
}