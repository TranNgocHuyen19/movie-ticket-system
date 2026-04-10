package com.fit.iuh.userservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.kafka.topics.user-registered:user.registered}")
    private String userRegisteredTopic;

    public UserEventPublisher(
            KafkaTemplate<String, String> kafkaTemplate,
            ObjectMapper objectMapper
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishUserRegistered(User user) {
        String eventPayload = serializeEvent(UserRegisteredEvent.fromUser(user));
        String messageKey = String.valueOf(user.getId());

        kafkaTemplate.send(userRegisteredTopic, messageKey, eventPayload)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to publish USER_REGISTERED event for userId={}", user.getId(), ex);
                        return;
                    }
                    log.info("Published USER_REGISTERED event for userId={} to topic={}", user.getId(), userRegisteredTopic);
                });
    }

    private String serializeEvent(UserRegisteredEvent event) {
        try {
            return objectMapper.writeValueAsString(event);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Failed to serialize USER_REGISTERED event", ex);
        }
    }
}
