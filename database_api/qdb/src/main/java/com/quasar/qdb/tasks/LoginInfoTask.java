package com.quasar.qdb.tasks;

import com.quasar.qdb.QDBConstsAndUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Component
public class LoginInfoTask {
  private final static Logger log = LoggerFactory.getLogger(LoginInfoTask.class);
  private static final String CUSTOMER_ID = "customer_id";
  private static final String DFS_VERSION = "dfs_version";
  private static final String DFS_BUILD = "dfs_build";
  private static final String OTHER_ID = "other_id";
  private static final String HARDWARE = "hardware";
  private static final String SDK_INT = "sdk_int";
  private static final String BRAND = "brand";
  private static final String MAC = "mac";
  private static final String MANUFACTURER = "manufacturer";
  private static final String RELEASE = "release";
  private static final String MODEL = "model";
  private static final String SERIAL = "serial";
  private static final String PAYLOAD = "payload";
  private static final String RESPONSE_TYPE_LOGIN_INFO = "login_info_response";
  
  @Value("${kafka.topics.deviceUpdates}")
  String queryServiceDeviceUpdates;

  ObjectMapper objectMapper;
  MongoTemplate mongoTemplate;  
  KafkaTemplate<String, String> kafkaTemplate;
  
  public LoginInfoTask(ObjectMapper objectMapper, 
                       MongoTemplate mongoTemplate, 
                       KafkaTemplate<String, String> kafkaTemplate) {
    this.objectMapper = objectMapper;
    this.mongoTemplate = mongoTemplate;
    this.kafkaTemplate = kafkaTemplate;
  }
  
  public String retrieveLoginInfoForDevice(final ObjectNode payload) throws JsonProcessingException {

    Integer requestId = 0;
    if(payload.has("request_id")) {
      requestId = payload.get("request_id").intValue();
    }
    
    String uniqueId = null;
    if(payload.has(QDBConstsAndUtils.UNIQUE_ID)) {
      uniqueId = payload.get(QDBConstsAndUtils.UNIQUE_ID).asText();
    } else {
      return objectMapper.writeValueAsString( QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, RESPONSE_TYPE_LOGIN_INFO, "sfs", requestId, HttpStatus.SC_INTERNAL_SERVER_ERROR, "Internal Server Error", objectMapper.createObjectNode()) );
    }
    
    String customerId = null;
    if(payload.has(QDBConstsAndUtils.CUSTOMER_ID)) {
      customerId = payload.get(QDBConstsAndUtils.CUSTOMER_ID).asText();
    } else {
      return objectMapper.writeValueAsString( QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, RESPONSE_TYPE_LOGIN_INFO, "sfs", requestId, HttpStatus.SC_INTERNAL_SERVER_ERROR, "Invalid customer ID", objectMapper.createObjectNode()) );
    }

    if(StringUtils.isBlank(customerId)) {
      return objectMapper.writeValueAsString( QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, RESPONSE_TYPE_LOGIN_INFO, "sfs", requestId, HttpStatus.SC_BAD_REQUEST, "Invalid customer ID", payload) );
    }

    Query customerQuery = Query.query(Criteria.where(QDBConstsAndUtils.CUSTOMER_ID).is(customerId));
    Customer myCustomer = mongoTemplate.findOne(customerQuery, Customer.class);    
    
    if(myCustomer != null) {

      myCustomer.setCustomerId(null);
      myCustomer.setName(null);
      myCustomer.setDescription(null);
      myCustomer.setUrl(null);
      ObjectNode returnNode = objectMapper.createObjectNode();
      
      QDBConstsAndUtils.addBasicInfoToMessagePayload(returnNode, "sfs", requestId, HttpStatus.SC_OK, "OK", RESPONSE_TYPE_LOGIN_INFO);
      JsonNode customerNode = objectMapper.valueToTree(myCustomer);
      returnNode.set("customer", customerNode);
      
      ObjectNode msg = objectMapper.createObjectNode();
      msg.put(QDBConstsAndUtils.UNIQUE_ID, uniqueId);
      msg.put(QDBConstsAndUtils.REQUEST_TYPE, RESPONSE_TYPE_LOGIN_INFO);
      msg.set(PAYLOAD, returnNode);
      
      JsonNode incDeviceNode = payload.get("device");
      if(incDeviceNode != null) {
        //Construct a message to send through kafka to save the device
        ObjectNode deviceNode = objectMapper.createObjectNode();
        deviceNode.put(QDBConstsAndUtils.UNIQUE_ID, uniqueId);
        deviceNode.put(QDBConstsAndUtils.CUSTOMER_ID, customerId);
        
        if(incDeviceNode.has(SERIAL)) {
          deviceNode.put(SERIAL, incDeviceNode.get(SERIAL).textValue());
        }
        
        if(incDeviceNode.has(MODEL)) {
          deviceNode.put(MODEL, incDeviceNode.get(MODEL).textValue());
        }

        if(incDeviceNode.has(RELEASE)) {
          deviceNode.put(RELEASE, incDeviceNode.get(RELEASE).textValue());
        }
        
        if(incDeviceNode.has(MANUFACTURER)) {
          deviceNode.put(MANUFACTURER, incDeviceNode.get(MANUFACTURER).textValue());
        }
        
        if(incDeviceNode.has(MAC)) {
          deviceNode.put(MAC, incDeviceNode.get(MAC).textValue());
        }

        if(incDeviceNode.has(BRAND)) {
          deviceNode.put(BRAND, incDeviceNode.get(BRAND).textValue());
        }
        
        if(incDeviceNode.has(SDK_INT)) {
          deviceNode.put(SDK_INT, incDeviceNode.get(SDK_INT).textValue());
        }
        
        if(incDeviceNode.has(HARDWARE)) {
          deviceNode.put(HARDWARE, incDeviceNode.get(HARDWARE).textValue());
        }

        if(incDeviceNode.has(OTHER_ID)) {
          deviceNode.put(OTHER_ID, incDeviceNode.get(OTHER_ID).textValue());
        }
        
        if(incDeviceNode.has(DFS_BUILD)) {
          deviceNode.put(DFS_BUILD, incDeviceNode.get(DFS_BUILD).textValue());
        }
        
        if(incDeviceNode.has(DFS_VERSION)) {
          deviceNode.put(DFS_VERSION, incDeviceNode.get(DFS_VERSION).textValue());
        }
        
        if(incDeviceNode.has(CUSTOMER_ID)) {
          deviceNode.put(CUSTOMER_ID, incDeviceNode.get(CUSTOMER_ID).textValue());
        }
        
        kafkaTemplate.send(queryServiceDeviceUpdates, objectMapper.writeValueAsString(deviceNode));
        return objectMapper.writeValueAsString(msg);

      } else {
        return objectMapper.writeValueAsString( QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, RESPONSE_TYPE_LOGIN_INFO, "sfs", requestId, HttpStatus.SC_BAD_REQUEST, "Device information cannot be empty", payload) );
      }
      
    } else {
      return objectMapper.writeValueAsString( QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, RESPONSE_TYPE_LOGIN_INFO, "sfs", requestId, HttpStatus.SC_BAD_REQUEST, "Customer ID not found", payload) );
    }
    
  }
  
}
