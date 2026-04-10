package com.fit.iuh.paymentservice.service;

import com.fit.iuh.paymentservice.config.KafkaConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired(required = false)
    private WebClient webClient;

    /**
     * Gửi notification khi thanh toán thành công
     * Có thể gọi API hoặc log tuỳ theo cấu hình
     */
    public void sendNotification(String bookingId) {
        try {
            String message = "User A đã đặt đơn #" + bookingId + " thành công";
            logger.info("Booking #{} thành công!", bookingId);
            System.out.println(message);
            
            // Tùy chọn: Gọi Notification API nếu có
            // sendNotificationViaApi(bookingId, message);
        } catch (Exception e) {
            logger.error("Error sending notification for booking: {}", bookingId, e);
        }
    }    /**
     * Lắng nghe sự kiện thanh toán thành công từ Kafka (dự phòng)
     */
    @KafkaListener(topics = KafkaConfig.PAYMENT_COMPLETED_TOPIC, groupId = "notification-service-group")
    public void onPaymentCompleted(String bookingId) {
        sendNotification(bookingId);
    }

    /**
     * Tùy chọn: Gọi API để gửi notification
     * (nếu có dịch vụ notification riêng)
     */
    private void sendNotificationViaApi(String bookingId, String message) {
        try {
            if (webClient != null) {
                logger.info("Sending notification via API for booking: {}", bookingId);
                // webClient.post()
                //         .uri("/api/v1/notifications/send")
                //         .bodyValue(new NotificationRequest(bookingId, message))
                //         .retrieve()
                //         .bodyToMono(Void.class)
                //         .block();
            }
        } catch (Exception e) {
            logger.error("Failed to send notification via API for booking: {}", bookingId, e);
        }
    }
}
