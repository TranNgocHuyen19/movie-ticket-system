package com.fit.iuh.bookingservice.integration.client;

import com.fit.iuh.bookingservice.integration.dto.ExternalApiResponse;
import com.fit.iuh.bookingservice.integration.dto.TokenValidationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "auth-service", url = "${clients.user-service.url}")
public interface AuthServiceClient {

    @PostMapping("/auth/validate")
    ExternalApiResponse<TokenValidationResponse> validateToken(
            @RequestHeader(value = "Authorization", required = false) String authorization
    );
}