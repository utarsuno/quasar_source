package com.quasar.qdb.tasks;

import java.io.IOException;
import java.nio.charset.Charset;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import com.quasar.qdb.QDBConstsAndUtils;
import com.quasar.qdb.data.DeviceToken;
import com.quasar.qdb.data.Role;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.kafka.requestreply.ReplyingKafkaTemplate;
import org.springframework.kafka.requestreply.RequestReplyFuture;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.core.IMap;
import com.quasar.qdb.services.LoginNotificationService;

@Component
public class UserLoginTask {
  private final static Logger log = LoggerFactory.getLogger(UserLoginTask.class);
  private static final Decoder base64Decoder = Base64.getUrlDecoder();

  private static final String REQUEST_TYPE = "request_type";
  private static final String ACCESS_TOKENS = "access_tokens";
  private static final String OAUTH2 = "oauth2";
  private static final String BASIC = "basic";
  private static final String REQUEST_ID = "request_id";
  private static final String ACCESS_CODE = "access_code";
  private static final String LOGIN_PASSWORD = "login_password";
  private static final String LOGIN_NAME = "login_name";
  private static final String UNIQUE_ID = "unique_id";
  private static final String RESPONSE_TYPE_USER_LOGIN = "user_login_response";
  private static final String SUCCESS = "SUCCESS";
  private static final String FAILURE = "FAILURE";

  /**
   * Map to persist the login_name - mongo db user id association
   */
  private static final String LOGIN_NAME_TO_ID = "login_name_to_id";

  @Value("${oauth2.token}")
  String tokenUrl;

  @Value("${oauth2.adfs.client_id}")
  String clientId;

  @Value("${kafka.topics.presence}")
  String presenceTopic;
  
  @Value("${kafka.replytopics.profilereply.receiveTopic.value}")
  private String profileReplyReceiveTopic;
  
  @Value("${kafka.replytopics.profilereply.sendTopic.value}")
  private String profileReplySendTopic;     

  private final ObjectMapper objectMapper;
  private final MongoTemplate mongoTemplate;
  private final HazelcastInstance hz;
  private final ReplyingKafkaTemplate<String, String, String> kafkaTemplate;
  private final LoginNotificationService loginNotificationService;
  private final IMap<String, String> accessTokenMap;
  private final IMap<String, String> loginNameToIdMap;
  
  @Autowired
  public UserLoginTask(ObjectMapper objectMapper, 
                       MongoTemplate mongoTemplate, 
                       HazelcastInstance hz,
                       ReplyingKafkaTemplate<String, String, String> kafkaTemplate, 
                       LoginNotificationService loginNotificationService) {
    this.objectMapper = objectMapper;
    this.mongoTemplate = mongoTemplate;
    this.hz = hz;
    this.kafkaTemplate = kafkaTemplate;
    this.loginNotificationService = loginNotificationService;
    this.accessTokenMap = hz.getMap(ACCESS_TOKENS);
    this.loginNameToIdMap = hz.getMap(LOGIN_NAME_TO_ID);
  }

  public String performUserLogin(final ObjectNode payload) throws IOException {

    String username = null;
    String password = null;
    Integer requestId = null;
    String accessCode = null;
    String uniqueId = null;

    if (payload.has(UNIQUE_ID)) {
      uniqueId = payload.get(UNIQUE_ID).asText();
    }

    if (payload.has(LOGIN_NAME)) {
      username = payload.get(LOGIN_NAME).asText();
    }

    if (payload.has(LOGIN_PASSWORD)) {
      password = payload.get(LOGIN_PASSWORD).asText();
    }

    if (payload.has(ACCESS_CODE)) {
      accessCode = payload.get(ACCESS_CODE).asText();
    }

    if (payload.has(REQUEST_ID)) {
      requestId = payload.get(REQUEST_ID).intValue();
    }

    // Right now we can't do anything fancy due to extracting the username from the
    // access token in the case of ADFS
    // So if there's a username or password, we assume basic login, if there's an
    // access code and no username and password, we assume OAUTH2
    String loginType = "";
    if (StringUtils.isNotBlank(username) && StringUtils.isNotBlank(password) && StringUtils.isBlank(accessCode)) {
      loginType = BASIC;
    } else if (StringUtils.isBlank(username) && StringUtils.isBlank(password) && StringUtils.isNotBlank(accessCode)) {
      loginType = OAUTH2;
    } else {
      return objectMapper.writeValueAsString(QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, RESPONSE_TYPE_USER_LOGIN, "sfs",
          requestId, HttpStatus.SC_BAD_REQUEST, "Invalid username or password", objectMapper.createObjectNode()));
    }

    if (BASIC.equalsIgnoreCase(loginType)) {

      Map<String, Object> result = performBasicLogin(username, password, uniqueId, requestId, loginType);
      JsonNode user = (JsonNode) result.get("user");
      final String userId = user.get("id").textValue();

      if (result.get(SUCCESS) != null) {
        String kafkaMsg = QDBConstsAndUtils.buildPresenceUpdate(objectMapper, "ONLINE", uniqueId, userId);
        kafkaTemplate.send(presenceTopic, kafkaMsg);

        // Notify system of successful login
        loginNotificationService.sendNotification(uniqueId, userId, username);

        return (String) result.get(SUCCESS);
      } else {
        String kafkaMsg = QDBConstsAndUtils.buildPresenceUpdate(objectMapper, "OFFLINE", uniqueId, userId);
        kafkaTemplate.send(presenceTopic, kafkaMsg);
        return (String) result.get(FAILURE);
      }

    } else if (OAUTH2.equalsIgnoreCase(loginType)) {

      Map<String, Object> result = performOAuth2Login(accessCode, uniqueId, requestId, loginType);
        JsonNode user = (JsonNode) result.get("user");
        final String userId = user.get("id").textValue();

      if (result.get(SUCCESS) != null) {
        String kafkaMsg = QDBConstsAndUtils.buildPresenceUpdate(objectMapper, "ONLINE", uniqueId, userId);
        kafkaTemplate.send(presenceTopic, kafkaMsg);

        // Notify system of successful login
        loginNotificationService.sendNotification(uniqueId, userId, username);

        return (String) result.get(SUCCESS);
      } else {
        String kafkaMsg = QDBConstsAndUtils.buildPresenceUpdate(objectMapper, "OFFLINE", uniqueId, userId);
        kafkaTemplate.send(presenceTopic, kafkaMsg);
        return (String) result.get(FAILURE);
      }
    } else {
      return objectMapper.writeValueAsString(QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, RESPONSE_TYPE_USER_LOGIN, "sfs",
          requestId, HttpStatus.SC_BAD_REQUEST, "Unrecognized AuthMethod", objectMapper.createObjectNode()));
    }

  }

  private boolean isValidPassword(String userPassword, String password) {
    // return true; // DEBUG line only. DO NOT LET THIS GO TO PRODUCTION.
    return true;//PasswordUtil.verify(userPassword, password.toCharArray(), Charset.defaultCharset());
  }

  private Map<String, Object> performBasicLogin(String username, String password, String uniqueId, Integer requestId,
      String assumedLoginType) throws IOException {
    log.debug("performBasicLogin: Attempting login of {}, on device {}", username, uniqueId);

    Map<String, Object> returnMap = getUser(username, uniqueId, requestId, assumedLoginType);
    if (returnMap.get(FAILURE) != null) {
      return Collections.singletonMap(FAILURE, (String) returnMap.get(FAILURE));
    }

    JsonNode user = (JsonNode) returnMap.get(SUCCESS);

    if (!isValidPassword(user.get("login_password").asText(), password)) {
      return Collections.singletonMap(FAILURE,
          objectMapper.writeValueAsString(QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, RESPONSE_TYPE_USER_LOGIN, "sfs",
              requestId, HttpStatus.SC_BAD_REQUEST, "Invalid username or password", objectMapper.createObjectNode())));
    }

    String token = "";
    try {
      accessTokenMap.lock(uniqueId, 5000, TimeUnit.MILLISECONDS);
      token = UUID.randomUUID().toString();
      accessTokenMap.set(uniqueId, token);
    } finally {
      accessTokenMap.unlock(uniqueId);
    }

    if(StringUtils.isBlank(token)) {
      return Collections.singletonMap(FAILURE, (String)"Could not set token inside hazelcast");
    }
    
    persistLoginNameUserIdPair(username, user.get("id").textValue());

    // Looks like we got a user, now to generate them a token and have it last for 8 hours
    Instant eight_hours_from_now = Instant.now().plusSeconds(28800);

    DeviceToken deviceToken = new DeviceToken();
    deviceToken.setUniqueId(uniqueId);
    deviceToken.setId(token);
    deviceToken.setExpires(eight_hours_from_now);
    
    String retVal = objectMapper.writeValueAsString(makeDataAndGetMessage(user, deviceToken, requestId, uniqueId));

      //We can't lose user information. Client code will have to inspect this structure
      // and pick what they need.
    HashMap<String, Object> res = new HashMap<>();
    res.put(SUCCESS, retVal);
    res.put("user", user);

      return res;
  }

    /**
     * Associate the login_name with the user id (MongoDB).
     * This map will be used by sfs-service to build and send presence updates messages.
     * @param username The login_name sent by DFS
     * @param id The internal user id
     */
  private void persistLoginNameUserIdPair(String username, String id){
    log.debug("Persisting to Hz pair ({}, {})", username, id);

    try {
      loginNameToIdMap.lock(username, 5000, TimeUnit.MILLISECONDS);
      loginNameToIdMap.set(username, id);
    } finally {
      loginNameToIdMap.unlock(username);
    }
    
  }

  private Map<String, Object> performOAuth2Login(String accessCode, String uniqueId, Integer requestId, String assumedLoginType)
      throws IOException {

    if (StringUtils.isBlank(accessCode)) {
      return Collections.singletonMap(FAILURE, objectMapper.writeValueAsString(QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId,
          RESPONSE_TYPE_USER_LOGIN, "sfs", requestId, HttpStatus.SC_BAD_REQUEST, "Invalid access code", objectMapper.createObjectNode())));
    }

    String responseEntity = null;

    try (CloseableHttpClient client = HttpClients.createDefault()) {
      HttpPost httpPost = new HttpPost(tokenUrl);

      List<NameValuePair> params = new ArrayList<NameValuePair>();
      params.add(new BasicNameValuePair("grant_type", "authorization_code"));
      params.add(new BasicNameValuePair("client_id", clientId));
      params.add(new BasicNameValuePair("redirect_uri", "https://localhost"));
      params.add(new BasicNameValuePair("code", accessCode));
      httpPost.setEntity(new UrlEncodedFormEntity(params));
      httpPost.addHeader("Content-Type", "application/x-www-form-urlencoded");
      CloseableHttpResponse response = client.execute(httpPost);

      HttpEntity entity = response.getEntity();
      responseEntity = EntityUtils.toString(entity, Charset.forName("UTF-8"));
      EntityUtils.consumeQuietly(entity);
      // These should be auto closed with the try with resources, but it doesn't hurt
      // to just make sure they are closed.
      response.close();
      client.close();
    } catch (IOException e1) {
      log.error("Could not connect to ADFS");
      return Collections.singletonMap(FAILURE,
          objectMapper.writeValueAsString(QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, RESPONSE_TYPE_USER_LOGIN, "sfs",
              requestId, HttpStatus.SC_INTERNAL_SERVER_ERROR, "Could not access ADFS", objectMapper.createObjectNode())));
    }

    // Next step is to save these tokens to use later
    ADFSDeviceToken adfsToken;
    try {
      adfsToken = objectMapper.readValue(responseEntity, ADFSDeviceToken.class);
    } catch (Exception e) {
      // If we can't parse the response perfectly, we need to assume the ADFS auth
      // request failed
      return Collections.singletonMap(FAILURE, objectMapper.writeValueAsString(QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId,
          RESPONSE_TYPE_USER_LOGIN, "sfs", requestId, HttpStatus.SC_BAD_REQUEST, "Invalid access code", objectMapper.createObjectNode())));
    }

    // Now we extract the user ID out of the access token
    String decodedString = new String(base64Decoder.decode(adfsToken.getIdToken().split("\\.")[1]));

    String username = "";

    if (StringUtils.contains(decodedString, "unique_name")) {
      JsonNode miscInfo = objectMapper.readTree(decodedString);
      username = miscInfo.get("unique_name").asText();
    }

    Map<String, Object> returnMap = getUser(username, uniqueId, requestId, assumedLoginType);
    if (returnMap.get(FAILURE) != null) {
      return Collections.singletonMap(FAILURE, (String) returnMap.get(FAILURE));
    }

    JsonNode user = (JsonNode) returnMap.get(SUCCESS);

    try {
      accessTokenMap.lock(uniqueId, 5000, TimeUnit.MILLISECONDS);
      accessTokenMap.set(uniqueId, adfsToken.getAccessToken());
    } finally {
      accessTokenMap.unlock(uniqueId);
    }

    persistLoginNameUserIdPair(username, user.get("id").textValue());

    DeviceToken deviceToken = new DeviceToken();
    deviceToken.setUniqueId(uniqueId);
    deviceToken.setId(adfsToken.getAccessToken());
    deviceToken.setExpires(Instant.now().plus(adfsToken.getExpiresIn(), ChronoUnit.SECONDS));

    String retVal = objectMapper.writeValueAsString(makeDataAndGetMessage(user, deviceToken, requestId, uniqueId));

    HashMap<String, Object> res = new HashMap<>();
    res.put(SUCCESS, retVal);
    res.put("user", user); // This contains the user id.
    return res;
  }

  private Map<String, Object> getUser(String username, String uniqueId, Integer requestId, String assumedLoginType) throws IOException {

    // We need to lock it down so if a basic customer tries to log in with adfs, we
    // fail them and vice versa
    Map<String, Object> resultUser = getUserFromDBAndSendMessageIfFailure(username, uniqueId, RESPONSE_TYPE_USER_LOGIN, requestId);
    if (resultUser.get(FAILURE) != null) {
      return Collections.singletonMap(FAILURE, (String) resultUser.get(FAILURE));
    }

    JsonNode user = (JsonNode) resultUser.get(SUCCESS);

    if (user == null) {
      return Collections.singletonMap(FAILURE,
          objectMapper.writeValueAsString(QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, RESPONSE_TYPE_USER_LOGIN, "sfs",
              requestId, HttpStatus.SC_BAD_REQUEST, "Invalid username or password", objectMapper.createObjectNode())));
    }

    String authMethod = user.get("authentication_method").asText();

    if (StringUtils.isBlank(authMethod)) {
      log.error("User {} has no specified authentication method. This is very bad.", authMethod);
      return Collections.singletonMap(FAILURE,
          objectMapper.writeValueAsString(QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, RESPONSE_TYPE_USER_LOGIN, "sfs",
              requestId, HttpStatus.SC_BAD_REQUEST, "Customer has no specified authentication method", objectMapper.createObjectNode())));
    } else if (!StringUtils.equalsIgnoreCase(assumedLoginType, authMethod)) {
      log.error("Requested {} authentication but auth_method {} was supplied", authMethod, assumedLoginType);
      return Collections.singletonMap(FAILURE, objectMapper
              .writeValueAsString(QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, RESPONSE_TYPE_USER_LOGIN, "sfs", requestId,
                  HttpStatus.SC_BAD_REQUEST, "Customer auth method does not match supplied auth method", objectMapper.createObjectNode())));
    }
    log.debug("User so far is {}", user);
    return Collections.singletonMap(SUCCESS, user);

  }

  private Map<String, Object> getUserFromDBAndSendMessageIfFailure(String username, String uniqueId, String requestType, Integer requestId) throws IOException {

    //This is an odd one -- if I try to serialize to a User object, it leaves out fields. If I take it out as a String
    //then bind it to JSON directly with Jackson, it gives all the fields fine. It really seems like a bug in Spring data mongodb.
    Query findUserQuery = Query.query(Criteria.where("properties.login_name").is(username));
    String userStr = mongoTemplate.findOne(findUserQuery, String.class, "users");
    log.debug("User str found: {}", userStr);
    JsonNode user = null;
    
    if(!StringUtils.isBlank(userStr)) { 
      user = objectMapper.readTree(userStr);
    }

    if (user == null || !user.has("properties")) {
      return Collections.singletonMap(FAILURE,
          objectMapper.writeValueAsString(QDBConstsAndUtils.createErrorMessage(objectMapper, uniqueId, RESPONSE_TYPE_USER_LOGIN, "sfs",
              requestId, HttpStatus.SC_BAD_REQUEST, "Invalid username or password", objectMapper.createObjectNode())));
    }

    log.debug("User {} found.", username);

    // We need to shove in the database id because it is required by the rest of the application.
    // Client code up in the stack must preserve this id somehow, so other code can build messages that include the user ID.
    String userId = user.get("_id").get("$oid").textValue();
    log.debug("User id is {}.", userId);

    ObjectNode res = (ObjectNode)user.get("properties");
    res.put("id", userId);

    log.debug("Enriched user map is {}.", res);

    return Collections.singletonMap(SUCCESS, res);
  }

  @Value("${queryservice.scheme}://${queryservice.host}:${queryservice.port}${queryservice.context-path}${queryservice.profiles.base}")
  String profilesBaseUrl;
  
  private ObjectNode makeDataAndGetMessage(JsonNode user, DeviceToken deviceToken, Integer requestId, String uniqueId) {

    ObjectNode returnNode = objectMapper.createObjectNode();
    QDBConstsAndUtils.addBasicInfoToMessagePayload(returnNode, "sfs", requestId, HttpStatus.SC_OK, "OK", RESPONSE_TYPE_USER_LOGIN);

    ObjectNode userNode = objectMapper.createObjectNode();

    userNode.put("login_name", user.get("login_name").asText());
    
    if(user.has("first_name")) {
      userNode.put("first_name", user.get("first_name").asText());
    }
    
    if(user.has("last_name")) {
      userNode.put("last_name", user.get("last_name").asText());
    }
    
    //LOEWS EDIT: Grab a profile by a username if it exists from the query service
    try {
      //final String uri =  UriComponentsBuilder.fromHttpUrl(profilesBaseUrl + "/byUsername/" + user.get("login_name").asText()).toUriString();
      //log.debug("Calling {}", uri);
      //String userProfiles = restTemplate.getForObject(uri, String.class);biubib
      
      KafkaReplyMessage<String> kReplyMessage = new KafkaReplyMessage<String>();
      kReplyMessage.setRequestType("getProfileByUsername");
      kReplyMessage.setPayload( user.get("login_name").asText() );
      
      ProducerRecord<String, String> record = new ProducerRecord<>(profileReplyReceiveTopic, objectMapper.writeValueAsString(kReplyMessage));
      record.headers().add(new RecordHeader(KafkaHeaders.REPLY_TOPIC, profileReplySendTopic.getBytes()));
      RequestReplyFuture<String, String, String> replyFuture = kafkaTemplate.sendAndReceive(record);
      ConsumerRecord<String, String> consumerRecord = replyFuture.get(5, TimeUnit.SECONDS);
      
      if(StringUtils.isNotBlank(consumerRecord.value())) {
        JsonNode userProfilesNode = objectMapper.readTree(consumerRecord.value());
        userNode.set("profiles", userProfilesNode);        
      }
      
    } catch(Exception e) {
      log.info("Could not grab user profile by name (may not exist on profile, may not be a problem");
    }
    
    //Grab the role information from Mongo
    JsonNode roles = user.get("roles");
    if( roles.isArray() ) {
      List<String> strRoles = new ArrayList<String>();
      for(final JsonNode objNode : roles) {
        strRoles.add( objNode.asText() );
      }
      
      Query userRoleQuery = Query.query(Criteria.where("name").in(strRoles));
      List<Role> roleList = mongoTemplate.find(userRoleQuery, Role.class);

      if(roleList != null) {
      
        for(Role role : roleList) {
          strRoles.remove(role.getName());
        }
      } else {
        roleList = new ArrayList<Role>();
      }
      
      if( !CollectionUtils.isEmpty(strRoles) ) {

        for(String strRole : strRoles) {
          Role role = new Role();
          role.setName(strRole);
          role.setDisplayName(strRole);
          role.setDescription(strRole);
          roleList.add(role);
        } 

      }
      
      userNode.set("roles", objectMapper.valueToTree(roleList) );
      
    } else {
      //Bad data is sent... Even a single role should be sent in an array. Will need to do some error checking here later.
    }
    
    userNode.set("token", objectMapper.valueToTree(deviceToken));

    returnNode.set("user", userNode);

    ObjectNode msg = objectMapper.createObjectNode();
    msg.put(UNIQUE_ID, uniqueId);
    msg.put(REQUEST_TYPE, RESPONSE_TYPE_USER_LOGIN);
    msg.set("payload", returnNode);

    return msg;
  }

}
