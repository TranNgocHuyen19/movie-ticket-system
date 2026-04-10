package com.fit.iuh.userservice.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fit.iuh.userservice.common.ApiError;
import com.fit.iuh.userservice.common.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public CustomAccessDeniedHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException {
        ApiError error = new ApiError(
                HttpServletResponse.SC_FORBIDDEN,
                "ACCESS_DENIED",
                "You are not allowed to access this resource",
                request.getRequestURI(),
                null
        );

        ApiResponse<Void> apiResponse = ApiResponse.error("Access denied", error);

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}
