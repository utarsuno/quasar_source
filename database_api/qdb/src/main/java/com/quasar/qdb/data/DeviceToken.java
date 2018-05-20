package com.quasar.qdb.data;

import java.io.Serializable;
import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonRootName;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "uniqueId", "token", "expires" })
@JsonRootName(value = "device_token")
public class DeviceToken implements Serializable {

  private static final long serialVersionUID = 1L;

  @JsonProperty("unique_id")
  private String uniqueId;
  
  @JsonProperty("id")
  private String id;
  
  @JsonProperty("expires")
  private Instant expires;

  @JsonProperty("unique_id")
  public String getUniqueId() {
    return uniqueId;
  }

  @JsonProperty("unique_id")
  public void setUniqueId(String uniqueId) {
    this.uniqueId = uniqueId;
  }

  @JsonProperty("id")
  public String getId() {
    return id;
  }
  
  @JsonProperty("id")
  public void setId(String id) {
    this.id = id;
  }

  @JsonProperty("expires")
  public Instant getExpires() {
    return expires;
  }

  @JsonProperty("expires")
  public void setExpires(Instant expires) {
    this.expires = expires;
  }

}
