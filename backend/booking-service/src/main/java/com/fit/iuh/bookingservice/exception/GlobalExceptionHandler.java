package com.fit.iuh.bookingservice.exception;

import com.fit.iuh.bookingservice.common.ApiError;
import com.fit.iuh.bookingservice.common.ApiResponse;
import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(NotFoundException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(ApiResponse.error(
            ex.getMessage(),
            new ApiError(
                HttpStatus.NOT_FOUND.value(),
                "NOT_FOUND",
                ex.getMessage(),
                request.getRequestURI(),
                Map.of()
            )
        ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
    Map<String, String> fieldErrors = new LinkedHashMap<>();
    ex.getBindingResult().getFieldErrors()
        .forEach(err -> fieldErrors.put(err.getField(), err.getDefaultMessage()));
    String message = "Validation failed: " + String.join(", ",
        fieldErrors.entrySet().stream().map(e -> e.getKey() + " " + e.getValue()).toList());
    return ResponseEntity.badRequest().body(ApiResponse.error(
        message,
        new ApiError(
            HttpStatus.BAD_REQUEST.value(),
            "VALIDATION_ERROR",
            message,
            request.getRequestURI(),
            fieldErrors
        )
    ));
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ApiResponse<Void>> handleFeign(FeignException ex, HttpServletRequest request) {
    HttpStatus status = HttpStatus.resolve(ex.status());
    if (status == null) {
        status = HttpStatus.BAD_GATEWAY;
    }
    String upstreamBody = ex.responseBody()
        .map(buf -> StandardCharsets.UTF_8.decode(buf).toString())
        .orElse("No response body");
    String message = "Upstream service error (" + ex.status() + "): " + upstreamBody;
    return ResponseEntity.status(status).body(ApiResponse.error(
        message,
        new ApiError(
            status.value(),
            "UPSTREAM_SERVICE_ERROR",
            message,
            request.getRequestURI(),
            Map.of()
        )
    ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleOthers(Exception ex, HttpServletRequest request) {
    String message = "Internal server error: " + ex.getMessage();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ApiResponse.error(
            message,
            new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "INTERNAL_SERVER_ERROR",
                message,
                request.getRequestURI(),
                Map.of()
            )
        ));
    }
}