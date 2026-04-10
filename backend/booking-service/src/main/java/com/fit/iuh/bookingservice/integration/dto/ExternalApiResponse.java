package com.fit.iuh.bookingservice.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExternalApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}