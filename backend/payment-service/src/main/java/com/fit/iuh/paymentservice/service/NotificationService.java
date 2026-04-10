package com.fit.iuh.paymentservice.service;

import com.fit.iuh.paymentservice.config.KafkaConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired(required = false)
    private RestTemplate restTemplate;

    @Value("${notification.service.base-url:}")
    private String notificationServiceBaseUrl;

    /**
     * Gửi notification khi thanh toán thành công
     * Có thể gọi API hoặc log tuỳ theo cấu hình
     */
    public void sendNotification(String bookingId) {
        try {
            String message = "User A đã đặt đơn #" + bookingId + " thành công";
            logger.info("Booking #{} thành công!", bookingId);
            logger.info(message);
            
            // Tùy chọn: Gọi Notification API nếu có
            // sendNotificationViaApi(bookingId, message);
        } catch (Exception e) {
            logger.error("Error sending notification for booking: {}", bookingId, e);
        }
    }

    /**
     * Lắng nghe sự kiện thanh toán thành công từ Kafka (dự phòng)
     */
    @KafkaListener(
            topics = KafkaConfig.PAYMENT_COMPLETED_TOPIC,
            groupId = "${spring.kafka.consumer.group-id:payment-service-group}"
    )
    public void onPaymentCompleted(String bookingId) {
        sendNotification(bookingId);
    }

    /**
     * Tùy chọn: Gọi API để gửi notification
     * (nếu có dịch vụ notification riêng)
     */
    private void sendNotificationViaApi(String bookingId, String message) {
        try {
            if (restTemplate != null && notificationServiceBaseUrl != null && !notificationServiceBaseUrl.isBlank()) {
                logger.info("Sending notification via API for booking: {}", bookingId);
                String notifyUrl = notificationServiceBaseUrl + "/api/v1/notifications/send";
                restTemplate.postForEntity(notifyUrl, new NotificationRequest(bookingId, message), Void.class);
            }
        } catch (Exception e) {
            logger.error("Failed to send notification via API for booking: {}", bookingId, e);
        }
    }

    private static class NotificationRequest {
        private String bookingId;
        private String message;

        NotificationRequest(String bookingId, String message) {
            this.bookingId = bookingId;
            this.message = message;
        }

        public String getBookingId() {
            return bookingId;
        }

        public String getMessage() {
            return message;
        }
    }
}
