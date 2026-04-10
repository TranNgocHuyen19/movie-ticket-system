package com.fit.iuh.bookingservice.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fit.iuh.bookingservice.common.ApiError;
import com.fit.iuh.bookingservice.common.ApiResponse;
import com.fit.iuh.bookingservice.integration.client.AuthServiceClient;
import com.fit.iuh.bookingservice.integration.dto.ExternalApiResponse;
import com.fit.iuh.bookingservice.integration.dto.TokenValidationResponse;
import feign.FeignException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class BookingAuthFilter extends OncePerRequestFilter {

    private final AuthServiceClient authServiceClient;
    private final ObjectMapper objectMapper;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        if ("OPTIONS".equalsIgnoreCase(method)) {
            return true;
        }
        if (!path.startsWith("/bookings")) {
            return true;
        }
        return !"GET".equalsIgnoreCase(method) && !"POST".equalsIgnoreCase(method);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        if (authorization == null || authorization.isBlank()) {
            writeUnauthorized(response, request, "Missing Authorization header");
            return;
        }

        try {
            ExternalApiResponse<TokenValidationResponse> validate = authServiceClient.validateToken(authorization);
            boolean valid = validate != null
                    && validate.isSuccess()
                    && validate.getData() != null
                    && validate.getData().isValid();
            if (!valid) {
                String message = validate != null && validate.getMessage() != null
                        ? validate.getMessage()
                        : "Invalid token";
                writeUnauthorized(response, request, message);
                return;
            }
        } catch (FeignException ex) {
            writeUnauthorized(response, request, "Token validation failed: " + ex.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void writeUnauthorized(HttpServletResponse response, HttpServletRequest request, String message)
            throws IOException {
        ApiResponse<Void> body = ApiResponse.error(
                message,
                new ApiError(
                        HttpStatus.UNAUTHORIZED.value(),
                        "UNAUTHORIZED",
                        message,
                        request.getRequestURI(),
                        Map.of()
                )
        );

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), body);
    }
}