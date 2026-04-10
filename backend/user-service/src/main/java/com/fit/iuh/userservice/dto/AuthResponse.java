package com.fit.iuh.userservice.dto;

public record AuthResponse(
        String token,
        String tokenType,
        UserResponse user
) {
}
