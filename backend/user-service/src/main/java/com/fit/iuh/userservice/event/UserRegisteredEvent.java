package com.fit.iuh.userservice.event;

import com.fit.iuh.userservice.entity.User;
import java.time.Instant;

public record UserRegisteredEvent(
        String eventType,
        Long userId,
        String username,
        String email,
        Instant occurredAt
) {

    public static UserRegisteredEvent fromUser(User user) {
        return new UserRegisteredEvent(
                "USER_REGISTERED",
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                Instant.now()
        );
    }
}
