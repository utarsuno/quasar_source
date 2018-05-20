package com.quasar.qdb.kafka;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.requestreply.ReplyingKafkaTemplate;
import org.springframework.kafka.requestreply.RequestReplyFuture;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class RemoveRoleListener {
    private final static Logger LOGGER = LoggerFactory.getLogger(RemoveRoleListener.class);

    @Value("${kafka.topics.todevice}")
    private String toDeviceTopic;

    @Value("${queryservice.scheme}://${queryservice.host}:${queryservice.port}${queryservice.context-path}${queryservice.extensions.base}")
    private String phoneExtensionsURL; 

    @Value("${kafka.replytopics.phonereply.receiveTopic.value}")
    private String phoneReplyReceiveTopic;
    
    @Value("${kafka.replytopics.phonereply.sendTopic.value}")
    private String phoneReplySendTopic;    
    
    private static final String REMOVE_ROLE_RESPONSE = "remove_role_response";

    private final ObjectMapper objectMapper;
    private final ReplyingKafkaTemplate<String, String, String> kafkaTemplate;

    @Autowired
    public RemoveRoleListener(ObjectMapper objectMapper, ReplyingKafkaTemplate<String, String, String> kafkaTemplate) {
        this.objectMapper = objectMapper;
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(id = "actionhandlerremoverolerequest", topics = "${kafka.topics.removerole}")
    private void listenForRemoveRoleRequest(String data) throws IOException, InterruptedException, ExecutionException, TimeoutException {
        LOGGER.debug(data);
        JsonNode event = objectMapper.readTree(data);
        JsonNode payload = event.get("eventTrigger").get("triggeringResource");

        final String uniqueId = payload.get("unique_id").asText();
        final String loginName = payload.get("login_name").asText();
        final int requestId = payload.get("request_id").intValue();

        // Before requesting the delete, we should validate that the login_name matches with
        // the one assigned to the device, which pretty much is odd since a user would have
        // to tamper with this message to be able to remove

        UniqueIdAndRoles uiar = new UniqueIdAndRoles();
        uiar.setUniqueId(uniqueId);
        uiar.setLoginName(loginName);

        List<String> roles = new ArrayList<>();
        for (JsonNode role : payload.get("role")) {
            roles.add(role.textValue());
        }

        uiar.setRoles(roles);

        KafkaReplyMessage<UniqueIdAndRoles> kReplyMessagePhone = new KafkaReplyMessage<UniqueIdAndRoles>();
        kReplyMessagePhone.setRequestType("removeExtensionsFromRoles");
        kReplyMessagePhone.setPayload( uiar );        
        
        ProducerRecord<String, String> recordPhone = new ProducerRecord<>(phoneReplyReceiveTopic, objectMapper.writeValueAsString(kReplyMessagePhone));
        recordPhone.headers().add(new RecordHeader(KafkaHeaders.REPLY_TOPIC, phoneReplySendTopic.getBytes()));
        RequestReplyFuture<String, String, String> replyFuturePhone = kafkaTemplate.sendAndReceive(recordPhone);
        
        SendResult<String, String> sendResult = replyFuturePhone.getSendFuture().get(5, TimeUnit.SECONDS);
        
        LOGGER.debug("Sent ok: " + sendResult.getRecordMetadata());
        
        /*
        
        //HttpHeaders headers = new HttpHeaders();
        //headers.add("Content-Type", MediaType.APPLICATION_JSON_VALUE);
        //final String body = objectMapper.writeValueAsString(uiar);
        //HttpEntity<String> request = new HttpEntity<>(body, headers);

        try {
            //LOGGER.debug("Invoking DELETE at {}", phoneExtensionsURL);
            //LOGGER.debug("Body: {}", body);
            //restTemplate.exchange(phoneExtensionsURL, HttpMethod.DELETE, request, String.class);
          
          //Make that new call here
          
          
        } catch (HttpClientErrorException e) {

            // Send REST error response to client
            String errorJSON =  objectMapper.writeValueAsString(
                    QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, REMOVE_ROLE_RESPONSE, "sfs", requestId,
                            e.getRawStatusCode(), e.getResponseBodyAsString(), objectMapper.createObjectNode())
            );

            kafkaTemplate.send(toDeviceTopic, errorJSON);

            LOGGER.error("Query service error {} {}", e.getRawStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            // Generic 500 error
            String errorJSON =  objectMapper.writeValueAsString(
                    QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, REMOVE_ROLE_RESPONSE, "sfs", requestId,
                            HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getLocalizedMessage(), objectMapper.createObjectNode())
            );

            kafkaTemplate.send(toDeviceTopic, errorJSON);

            LOGGER.error("Could not delete the roles.", e);
        }
        */
    }

}
