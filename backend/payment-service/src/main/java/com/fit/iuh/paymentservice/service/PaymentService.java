package com.fit.iuh.paymentservice.service;

import com.fit.iuh.paymentservice.config.KafkaConfig;
import com.fit.iuh.paymentservice.dto.PaymentRequest;
import com.fit.iuh.paymentservice.dto.PaymentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Random;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private WebClient webClient;

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
            
            // Gửi event đến Kafka
            kafkaTemplate.send(KafkaConfig.PAYMENT_FAILED_TOPIC, bookingId);
            
            return new PaymentResponse(bookingId, false, "Payment failed");
        }
    }    /**
     * Xử lý thanh toán từ Kafka (sự kiện từ booking-service)
     */
    @KafkaListener(topics = KafkaConfig.BOOKING_CREATED_TOPIC, groupId = "payment-service-group")
    public void processPaymentFromEvent(String bookingId) {
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
            
            // Gửi event đến Kafka
            kafkaTemplate.send(KafkaConfig.PAYMENT_FAILED_TOPIC, bookingId);
        }
    }

    /**
     * Cập nhật trạng thái order thông qua Order Service API
     */
    private void updateOrderStatus(String bookingId, String status) {
        try {
            logger.info("Updating order status for booking {} to {}", bookingId, status);
            
            webClient.put()
                    .uri("/api/v1/orders/{id}/status", bookingId)
                    .bodyValue(new OrderStatusUpdateRequest(status))
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
            
            logger.info("Order status updated successfully for booking: {}", bookingId);
        } catch (Exception e) {
            logger.error("Failed to update order status for booking: {}", bookingId, e);
        }
    }

    /**
     * DTO helper class để gửi request cập nhật trạng thái
     */
    private static class OrderStatusUpdateRequest {
        private String status;

        public OrderStatusUpdateRequest(String status) {
            this.status = status;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}
