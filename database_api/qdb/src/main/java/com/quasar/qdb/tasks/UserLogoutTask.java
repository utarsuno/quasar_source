package com.quasar.qdb.tasks;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quasar.qdb.QDBConstsAndUtils;
import com.quasar.qdb.services.LogoutNotificationService;

@Component
public class UserLogoutTask {

    private final static Logger log = LoggerFactory.getLogger(UserLogoutTask.class);

    private static final String REQUEST_TYPE_USER_LOGOUT = "user_logout_response";
    private static final String LOGIN_NAME = "login_name";
    private static final String UNIQUE_ID = "unique_id";

    @Value("${kafka.topics.presence}")
    String presenceTopic;

    private final ObjectMapper objectMapper;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final MongoTemplate mongoTemplate;
    private final LogoutNotificationService logoutNotificationService;

    @Autowired
    public UserLogoutTask(ObjectMapper objectMapper, KafkaTemplate<String, String> kafkaTemplate,
                          MongoTemplate mongoTemplate,
                          LogoutNotificationService logoutNotificationService) {
        this.objectMapper = objectMapper;
        this.kafkaTemplate = kafkaTemplate;
        this.mongoTemplate = mongoTemplate;
        this.logoutNotificationService = logoutNotificationService;
    }

    public String performUserLogout(final ObjectNode payload) throws IOException {
        String username = null;
        String uniqueId = null;

        if (payload.has(UNIQUE_ID)) {
            uniqueId = payload.get(UNIQUE_ID).asText();
        }

        if (payload.has(LOGIN_NAME)) {
            username = payload.get(LOGIN_NAME).asText();
        }

        if (!StringUtils.hasText(username)) {
          log.warn("Logout message does not contain an usable username. username: {}, device Id: {}", username, uniqueId);
          return ""; // We can't retrieve user from mongodb with an empty login_name.
        }

        String userId = getUserId(getUserByUsername(username));

        String kafkaMsg = QDBConstsAndUtils.buildPresenceUpdate(objectMapper, "OFFLINE", uniqueId, userId);
        kafkaTemplate.send(presenceTopic, kafkaMsg);

        logoutNotificationService.sendNotification(uniqueId, userId, username);

        return ""; //Change this if they ever want a logout message to the device
    }

    /**
     * FIXME This should go into some helper service, and remove the duplicate from UserLoginTask (about line 354)
     *
     * @param username
     * @return
     * @throws IOException
     */
    private JsonNode getUserByUsername(String username) throws IOException {
        Query findUserQuery = Query.query(Criteria.where("properties.login_name").is(username));
        String userStr = mongoTemplate.findOne(findUserQuery, String.class, "users");
        log.debug("User str found: {}", userStr);
        return objectMapper.readTree(userStr);
    }

    private String getUserId(JsonNode user) {
        return user.get("_id").get("$oid").textValue();
    }


}
