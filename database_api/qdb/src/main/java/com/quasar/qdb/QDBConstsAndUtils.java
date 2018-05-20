package com.quasar.qdb;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public interface QDBConstsAndUtils {
  public static final String MSG_VERSION = "1";
  public static final String UNIQUE_ID = "unique_id";
  public static final String CUSTOMER_ID = "customer_id";
  public static final String REQUEST_ID = "request_id";
  public static final String REQUEST_TYPE = "request_type";
  
  
  public static ObjectNode addBasicInfoToMessagePayload(ObjectNode inc, String origin, Integer requestId, Integer statusCode, String reasonPhrase, String requestType) {
    inc.put("origin", origin);
    inc.put("version", MSG_VERSION);
    inc.put("request_id", requestId);
    inc.put("status_code", statusCode);
    inc.put("reason_phrase", reasonPhrase);
    return inc;
  }

  public static ObjectNode createErrorMessage(ObjectMapper objectMapper, String uniqueId, String requestType, String origin, Integer requestId, Integer statusCode, String reasonPhrase, ObjectNode payload) {
    ObjectNode error = objectMapper.createObjectNode();
    error.put(UNIQUE_ID, uniqueId);
    error.put(REQUEST_ID, requestId);
    error.put("request_type", requestType);
    payload.put("origin", origin);
    payload.put("version", MSG_VERSION);
    payload.put("request_id", requestId);
    payload.put("status_code", statusCode);
    payload.put("reason_phrase", reasonPhrase);
    error.set("payload", payload);
    return error;
  }
  

}
