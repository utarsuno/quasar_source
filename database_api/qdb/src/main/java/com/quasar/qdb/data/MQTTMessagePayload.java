package com.quasar.qdb.data;

import java.io.Serializable;

public class MQTTMessagePayload<T> implements Serializable {

  private static final long serialVersionUID = 1L;

  String uniqueId;
  String origin;
  String dest;
  T payload;
  
  public String getUniqueId() {
    return uniqueId;
  }
  public void setUniqueId(String uniqueId) {
    this.uniqueId = uniqueId;
  }
  public String getOrigin() {
    return origin;
  }
  public void setOrigin(String origin) {
    this.origin = origin;
  }
  public String getDest() {
    return dest;
  }
  public void setDest(String dest) {
    this.dest = dest;
  }
  public T getPayload() {
    return payload;
  }
  public void setPayload(T payload) {
    this.payload = payload;
  }
  
}
