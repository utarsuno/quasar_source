package com.quasar.qdb.data;

import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Contains information about
 * - The rule that was triggered
 * - The fact
 * - Parameters for the action handler
 */
public class EventTrigger {

    private TriggeringRule triggeringRule;

    private ObjectNode triggeringResource;

    public TriggeringRule getTriggeringRule() {
      return triggeringRule;
    }

    public void setTriggeringRule(TriggeringRule triggeringRule) {
      this.triggeringRule = triggeringRule;
    }

    public ObjectNode getTriggeringResource() {
      return triggeringResource;
    }

    public void setTriggeringResource(ObjectNode triggeringResource) {
      this.triggeringResource = triggeringResource;
    }
    
}
