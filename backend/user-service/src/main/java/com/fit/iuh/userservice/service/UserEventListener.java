package com.fit.iuh.userservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class UserEventListener {

    private static final Logger log = LoggerFactory.getLogger(UserEventListener.class);

    @KafkaListener(
            topics = "${app.kafka.topics.user-registered:user.registered}",
            groupId = "${spring.kafka.consumer.group-id:user-service-group}"
    )
    public void onUserRegistered(String message) {
        log.info("Received USER_REGISTERED event: {}", message);
    }
}
