/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH under
 * one or more contributor license agreements. See the NOTICE file distributed
 * with this work for additional information regarding copyright ownership.
 * Licensed under the Camunda License 1.0. You may not use this file
 * except in compliance with the Camunda License 1.0.
 */
package io.camunda.search.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.OffsetDateTime;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ProcessInstanceEntity(
    Long key,
    String bpmnProcessId,
    String processName,
    Integer processVersion,
    String processVersionTag,
    Long processDefinitionKey,
    Long parentProcessInstanceKey,
    Long parentFlowNodeInstanceKey,
    String treePath,
    OffsetDateTime startDate,
    OffsetDateTime endDate,
    ProcessInstanceState state,
    Boolean incident,
    String tenantId) {

  public enum ProcessInstanceState {
    ACTIVE,
    COMPLETED,
    CANCELED;

    public static ProcessInstanceState fromValue(final String value) {
      for (final ProcessInstanceState state : ProcessInstanceState.values()) {
        if (state.name().equals(value)) {
          return state;
        }
      }
      throw new IllegalArgumentException("Unexpected value '" + value + "'");
    }
  }
}
