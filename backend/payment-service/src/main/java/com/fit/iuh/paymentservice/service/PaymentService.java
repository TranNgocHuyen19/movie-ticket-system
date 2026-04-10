package com.fit.iuh.paymentservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fit.iuh.paymentservice.config.KafkaConfig;
import com.fit.iuh.paymentservice.dto.PaymentRequest;
import com.fit.iuh.paymentservice.dto.PaymentResponse;
import java.util.Map;
import java.util.Random;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${order.service.base-url:http://localhost:8081}")
    private String orderServiceBaseUrl;

    @Autowired
    private NotificationService notificationService;

    /**
     * Xử lý thanh toán từ API request
     */
    public PaymentResponse processPaymentFromApi(PaymentRequest paymentRequest) {
        String bookingId = paymentRequest.getBookingId();
        logger.info("Processing payment from API for booking: {}", bookingId);

        boolean paymentSuccess = new Random().nextBoolean();

        if (paymentSuccess) {
            logger.info("Payment successful for booking: {}", bookingId);
            
            // Gọi Order Service để cập nhật trạng thái
            updateOrderStatus(bookingId, "PAID");
              // Gửi notification
            notificationService.sendNotification(bookingId);
            
            // Gửi event đến Kafka
            kafkaTemplate.send(KafkaConfig.PAYMENT_COMPLETED_TOPIC, bookingId);
            
            return new PaymentResponse(bookingId, true, "Payment successful");
        } else {
            logger.error("Payment failed for booking: {}", bookingId);
              // Cập nhật trạng thái order thành PAYMENT_FAILED
            updateOrderStatus(bookingId, "PAYMENT_FAILED");
            
            // Gửi event BOOKING_FAILED đến Kafka
            kafkaTemplate.send(KafkaConfig.BOOKING_FAILED_TOPIC, bookingId);
            
            return new PaymentResponse(bookingId, false, "Payment failed");
        }
    }    /**
     * Xử lý thanh toán từ Kafka (sự kiện từ booking-service)
     */
        @KafkaListener(
            topics = KafkaConfig.BOOKING_CREATED_TOPIC,
            groupId = "${spring.kafka.consumer.group-id:payment-service-group}"
        )
    public void processPaymentFromEvent(String bookingEventPayload) {
        String bookingId = extractBookingId(bookingEventPayload);
        logger.info("Received booking event from Kafka for payment processing: {}", bookingId);

        boolean paymentSuccess = new Random().nextBoolean();

        if (paymentSuccess) {
            logger.info("Payment successful for booking: {}", bookingId);
            
            // Gọi Order Service để cập nhật trạng thái
            updateOrderStatus(bookingId, "PAID");
              // Gửi notification
            notificationService.sendNotification(bookingId);
            
            // Gửi event đến Kafka
            kafkaTemplate.send(KafkaConfig.PAYMENT_COMPLETED_TOPIC, bookingId);
        } else {
            logger.error("Payment failed for booking: {}", bookingId);
            
            // Cập nhật trạng thái order thành PAYMENT_FAILED
            updateOrderStatus(bookingId, "PAYMENT_FAILED");
            
            // Gửi event BOOKING_FAILED đến Kafka
            kafkaTemplate.send(KafkaConfig.BOOKING_FAILED_TOPIC, bookingId);
        }
    }

    /**
     * Cập nhật trạng thái order thông qua Order Service API
     */
    private void updateOrderStatus(String bookingId, String status) {
        try {
            logger.info("Updating order status for booking {} to {}", bookingId, status);

            String updateStatusUrl = orderServiceBaseUrl + "/api/v1/orders/{id}/status";
            restTemplate.put(updateStatusUrl, Map.of("status", status), bookingId);
            
            logger.info("Order status updated successfully for booking: {}", bookingId);
        } catch (Exception e) {
            logger.error("Failed to update order status for booking: {}", bookingId, e);
        }
    }

    private String extractBookingId(String bookingEventPayload) {
        if (bookingEventPayload == null) {
            return null;
        }

        String trimmedPayload = bookingEventPayload.trim();
        if (!trimmedPayload.startsWith("{")) {
            return trimmedPayload;
        }

        try {
            JsonNode root = objectMapper.readTree(trimmedPayload);
            JsonNode bookingIdNode = root.get("bookingId");
            if (bookingIdNode != null && !bookingIdNode.isNull()) {
                return bookingIdNode.asText();
            }
        } catch (Exception ex) {
            logger.warn("Cannot parse BOOKING_CREATED payload as JSON, use raw payload as bookingId: {}", bookingEventPayload);
        }

        return trimmedPayload;
    }

}
