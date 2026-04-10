package com.fit.iuh.userservice.service;

import com.fit.iuh.userservice.entity.User;
import com.fit.iuh.userservice.event.UserRegisteredEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(UserEventPublisher.class);

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topics.user-registered:user.registered}")
    private String userRegisteredTopic;

    public UserEventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishUserRegistered(User user) {
        UserRegisteredEvent event = UserRegisteredEvent.fromUser(user);
        String messageKey = String.valueOf(user.getId());

        kafkaTemplate.send(userRegisteredTopic, messageKey, event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to publish USER_REGISTERED event for userId={}", user.getId(), ex);
                        return;
                    }
                    log.info("Published USER_REGISTERED event for userId={} to topic={}", user.getId(), userRegisteredTopic);
                });
    }
}
