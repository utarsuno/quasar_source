package com.quasar.qdb.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quasar.qdb.util.DateUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * Helper class to send out notifications about logout events.
 * When a user logs out of the device, the device information at query service has to be updated accordingly.
 * This message will be picked up by the query service's deviceAppStream app and remove the user information from
 * the device.
 */
@Service
public class LogoutNotificationService {

    private final String logoutUpdatesTopic;
    private final ObjectMapper objectMapper;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public LogoutNotificationService(@Value("${kafka.topics.logoutUpdates}") String logoutUpdatesTopic,
                                     ObjectMapper objectMapper,
                                     KafkaTemplate<String, String> kafkaTemplate) {
        this.logoutUpdatesTopic = logoutUpdatesTopic;
        this.objectMapper = objectMapper;
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * Send notification with the available user attributes.
     * @param deviceId The unique Id of the device
     * @param userId The user ID
     * @param login_name Value of the login_name
     * @throws IOException
     */
    public void sendNotification(String deviceId, String userId, String login_name) throws IOException {

        ObjectNode userNode = objectMapper.createObjectNode();
        userNode.put("id", userId);
        userNode.put("login_name", login_name);

        ObjectNode resNode = objectMapper.createObjectNode();
        resNode.put("deviceId", deviceId);
        resNode.put("logoutDate", DateUtil.currentDateStr());
        resNode.set("user", userNode);

        String msg = objectMapper.writeValueAsString(resNode);

        kafkaTemplate.send(logoutUpdatesTopic, msg);
    }


}
