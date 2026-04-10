package com.fit.iuh.paymentservice.controller;

import com.fit.iuh.paymentservice.dto.PaymentRequest;
import com.fit.iuh.paymentservice.dto.PaymentResponse;
import com.fit.iuh.paymentservice.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    /**
     * POST /api/v1/payments
     * Xử lý thanh toán cho một booking
     */
    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(@RequestBody PaymentRequest paymentRequest) {
        logger.info("Received payment request for booking: {}", paymentRequest.getBookingId());

        try {
            PaymentResponse response = paymentService.processPaymentFromApi(paymentRequest);
            
            if (response.getSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(response);
            }
        } catch (Exception e) {
            logger.error("Error processing payment: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new PaymentResponse(paymentRequest.getBookingId(), false, "Internal server error"));
        }
    }

    /**
     * GET /api/v1/payments/health
     * Kiểm tra trạng thái service
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Payment service is running");
    }
}
