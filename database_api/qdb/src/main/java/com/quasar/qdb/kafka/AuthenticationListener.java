package com.quasar.qdb.kafka;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quasar.qdb.data.RuleMatchEvent;
import com.quasar.qdb.tasks.LoginInfoTask;
import com.quasar.qdb.tasks.UserLoginTask;
import com.quasar.qdb.tasks.UserLogoutTask;

@Component
public class AuthenticationListener {
  private final static Logger log = LoggerFactory.getLogger(AuthenticationListener.class);

  private static final String REQUEST_TYPE_LOGIN_INFO = "login_info_request";
  private static final String REQUEST_TYPE_USER_LOGIN = "user_login_request";
  private static final String REQUEST_TYPE_USER_LOGOUT = "user_logout_request";  

  private static final String REQUEST_TYPE = "request_type";
  
  @Value("${kafka.topics.todevice}")
  private String toDeviceTopic;
  
  private ObjectMapper objectMapper;
  private KafkaTemplate<String, String> kafkaTemplate;
  private LoginInfoTask loginInfoTask;
  private UserLoginTask userLoginTask;
  private UserLogoutTask userLogoutTask;
  
  public AuthenticationListener(ObjectMapper objectMapper, LoginInfoTask loginInfoTask, UserLoginTask userLoginTask, KafkaTemplate<String, String> kafkaTemplate, UserLogoutTask userLogoutTask) {
    this.objectMapper = objectMapper;
    this.loginInfoTask = loginInfoTask;
    this.userLoginTask = userLoginTask;
    this.kafkaTemplate = kafkaTemplate;
    this.userLogoutTask = userLogoutTask;
  }
  
  @KafkaListener(id = "actionhandlerauthentication", topics = "${kafka.topics.handler}")
  private void listenForEvents(String data) throws IOException {

    log.debug(data);
    
    RuleMatchEvent event;
    try {
      event = objectMapper.readValue(data, RuleMatchEvent.class);
    } catch (IOException e) {
      log.error("Could not parse incoming event: {}", e);
      return;
    }

    ObjectNode node = event.getEventTrigger().getTriggeringResource();
    String outbound = "";
    if(node.has(REQUEST_TYPE)) {
      String requestType = node.get(REQUEST_TYPE).asText();
      if(REQUEST_TYPE_LOGIN_INFO.equals(requestType)) {
        outbound = loginInfoTask.retrieveLoginInfoForDevice( node );
      } else if(REQUEST_TYPE_USER_LOGIN.equals(requestType) ) {
        outbound = userLoginTask.performUserLogin( node );
      } else if(REQUEST_TYPE_USER_LOGOUT.equals(requestType)) {
        userLogoutTask.performUserLogout( node );
        return;        
      } else {
        return;
      }
      
    } else {
      return;
    }
    
    kafkaTemplate.send(toDeviceTopic, outbound);        

  }

}
