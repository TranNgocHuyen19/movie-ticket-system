package com.fit.iuh.userservice.dto;

import java.time.Instant;

public record TokenValidationResponse(
        boolean valid,
        String username,
        Instant expiresAt
) {
}
