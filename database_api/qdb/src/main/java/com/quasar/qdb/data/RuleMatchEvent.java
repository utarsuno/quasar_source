package com.quasar.qdb.data;

import java.time.ZonedDateTime;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * When a rule is triggered, this object is created
 * Represents the event written out to the kafka topic.
 */
public class RuleMatchEvent {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private ZonedDateTime eventDate;

    private EventTrigger eventTrigger;

    private Map<String, Object> actionHandlerParameters;

    public ZonedDateTime getEventDate() {
      return eventDate;
    }

    public void setEventDate(ZonedDateTime eventDate) {
      this.eventDate = eventDate;
    }

    public EventTrigger getEventTrigger() {
      return eventTrigger;
    }

    public void setEventTrigger(EventTrigger eventTrigger) {
      this.eventTrigger = eventTrigger;
    }

    public Map<String, Object> getActionHandlerParameters() {
      return actionHandlerParameters;
    }

    public void setActionHandlerParameters(Map<String, Object> actionHandlerParameters) {
      this.actionHandlerParameters = actionHandlerParameters;
    }
    
}
