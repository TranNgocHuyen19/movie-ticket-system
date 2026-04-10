package com.fit.iuh.bookingservice.integration.client;

import com.fit.iuh.bookingservice.integration.dto.ExternalApiResponse;
import com.fit.iuh.bookingservice.integration.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service", url = "${clients.user-service.url}")
public interface UserServiceClient {

    @GetMapping("/users/{id}")
    ExternalApiResponse<UserDto> getById(
            @PathVariable("id") Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization
    );
}