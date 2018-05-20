package com.quasar.qdb.kafka;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.apache.kafka.clients.consumer.ConsumerRecord;
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
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Component
public class ProfileListener {
    private final static Logger LOGGER = LoggerFactory.getLogger(ProfileListener.class);
    private static final String SET_ROLE_RESPONSE = "set_role_response";

    @Value("${kafka.topics.todevice}")
    private String toDeviceTopic;

    @Value("${kafka.replytopics.profilereply.receiveTopic.value}")
    private String profileReplyReceiveTopic;
    
    @Value("${kafka.replytopics.profilereply.sendTopic.value}")
    private String profileReplySendTopic;    
    
    @Value("${kafka.replytopics.phonereply.receiveTopic.value}")
    private String phoneReplyReceiveTopic;
    
    @Value("${kafka.replytopics.phonereply.sendTopic.value}")
    private String phoneReplySendTopic;
    
    private ObjectMapper objectMapper;
    private ReplyingKafkaTemplate<String, String, String> kafkaTemplate;

    @Autowired
    public ProfileListener(ObjectMapper objectMapper, ReplyingKafkaTemplate<String, String, String> kafkaTemplate) {
        this.objectMapper = objectMapper;
        this.kafkaTemplate = kafkaTemplate;
    }
    
    @KafkaListener(id = "actionhandlerprofile", topics = "${kafka.topics.profile}")
    private void listenForEvents(String data) throws IOException, InterruptedException, ExecutionException, TimeoutException {
        LOGGER.debug(data);

        JsonNode event = objectMapper.readTree(data);
        JsonNode payload = event.get("eventTrigger").get("triggeringResource");

        //Apparently, the rule's actionHandler specifies the name of the profile that needs to be enriched with extensions
        String extensionProfile = event.get("actionHandlerParameters").get("extensions").textValue();

        //First, get the profiles
        ObjectNode sendData = objectMapper.createObjectNode();
        sendData.set("profiles", event.get("actionHandlerParameters").get("profiles"));

        KafkaReplyMessage<ObjectNode> kReplyMessage = new KafkaReplyMessage<ObjectNode>();
        kReplyMessage.setRequestType("getProfiles");
        kReplyMessage.setPayload( sendData );
        
        ProducerRecord<String, String> record = new ProducerRecord<>(profileReplyReceiveTopic, objectMapper.writeValueAsString(kReplyMessage));
        record.headers().add(new RecordHeader(KafkaHeaders.REPLY_TOPIC, profileReplySendTopic.getBytes()));
        RequestReplyFuture<String, String, String> replyFuture = kafkaTemplate.sendAndReceive(record);
        ConsumerRecord<String, String> consumerRecord = replyFuture.get(5, TimeUnit.SECONDS);
        KafkaReplyMessage<List<Profile>> replyMessage = objectMapper.readValue(consumerRecord.value(), new TypeReference<KafkaReplyMessage<List<Profile>>>(){});

        List<Profile> profiles = replyMessage.getPayload();
        
        //Then get some extensions
        //TBD:

        //Then add the roles with their extensions to the role->extension mapping table
        final String login_name = payload.get("login_name").asText();
        UniqueIdAndExtensions uiae = new UniqueIdAndExtensions();
        uiae.setUniqueId(payload.get("unique_id").asText());
        uiae.setLoginName(login_name);

        Random rnd = new Random();
        String rndExtension = String.format("%04d", rnd.nextInt(10000));

        // (Apparently some random extension is assigned to the role)
        final String role = payload.get("role").asText();
        LOGGER.debug("Setting up role {} with ext {}", role, rndExtension);
        uiae.setRoleExtensions(Collections.singletonMap(role, rndExtension));

        //Apparently this configures the deviceId with the retrieved ext number (random for now), only if not alrady set (QS logic)
        LOGGER.debug("Sending extensions to device {}, user {}", uiae.getUniqueId(), login_name);

        KafkaReplyMessage<UniqueIdAndExtensions> kReplyMessagePhone = new KafkaReplyMessage<UniqueIdAndExtensions>();
        kReplyMessagePhone.setRequestType("addExtensionsForRoles");
        kReplyMessagePhone.setPayload( uiae );        
        
        ProducerRecord<String, String> recordPhone = new ProducerRecord<>(phoneReplyReceiveTopic, objectMapper.writeValueAsString(kReplyMessagePhone));
        recordPhone.headers().add(new RecordHeader(KafkaHeaders.REPLY_TOPIC, phoneReplySendTopic.getBytes()));
        RequestReplyFuture<String, String, String> replyFuturePhone = kafkaTemplate.sendAndReceive(recordPhone);
        ConsumerRecord<String, String> consumerRecordPhone = replyFuturePhone.get(5, TimeUnit.SECONDS);
        
        //Now add the extension to the profile we're sending back
        Profile p = profiles.stream().filter(x -> x.getName().equals(extensionProfile)).findFirst().get();

        JsonNode retExtension = objectMapper.readTree(consumerRecordPhone.value());

        //From my tests, this adds the extensionsn field to the LumberVoice profile
        p.getProfileProperties().put("extensions", retExtension.get("extension").textValue());

        //And we're done!

        ObjectNode returnData = objectMapper.createObjectNode();

        returnData.put("unique_id", payload.get("unique_id").asText());
        returnData.put("request_type", SET_ROLE_RESPONSE);

        ObjectNode returnPayload = objectMapper.createObjectNode();

        returnPayload.put("origin", "sfs");
        returnPayload.put("request_id", payload.get("request_id").asInt());
        returnPayload.put("version", payload.get("version").asText());
        returnPayload.put("status_code", 200);
        returnPayload.put("reason_phrase", "OK");
        returnPayload.set("profiles", objectMapper.readTree(objectMapper.writeValueAsString(profiles)));

        returnData.set("payload", returnPayload);

        kafkaTemplate.send(toDeviceTopic, objectMapper.writeValueAsString(returnData));

    }

}
