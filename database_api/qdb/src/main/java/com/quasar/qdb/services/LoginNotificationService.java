package com.quasar.qdb.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quasar.qdb.util.DateUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * Helper class to send out notifications about login events
 */
@Service
public class LoginNotificationService {

    private final String loginUpdatesTopic;
    private final ObjectMapper objectMapper;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public LoginNotificationService(@Value("${kafka.topics.loginUpdates}") String loginUpdatesTopic,
                                    ObjectMapper objectMapper,
                                    KafkaTemplate<String, String> kafkaTemplate) {
        this.loginUpdatesTopic = loginUpdatesTopic;
        this.objectMapper = objectMapper;
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * Send notification with the available user attributes.
     */
    public void sendNotification(String deviceId, String userId, String login_name) throws IOException {
        ObjectNode userNode = objectMapper.createObjectNode();
        userNode.put("id", userId);
        userNode.put("login_name", login_name);

        ObjectNode resNode = objectMapper.createObjectNode();
        resNode.put("deviceId", deviceId);
        resNode.put("loginDate", DateUtil.currentDateStr());
        resNode.set("user", userNode);

        String msg = objectMapper.writeValueAsString(resNode);

        kafkaTemplate.send(loginUpdatesTopic, msg);
    }
}
