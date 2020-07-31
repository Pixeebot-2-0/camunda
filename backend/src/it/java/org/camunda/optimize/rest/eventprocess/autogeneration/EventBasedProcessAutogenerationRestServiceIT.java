/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */
package org.camunda.optimize.rest.eventprocess.autogeneration;

import org.camunda.optimize.dto.optimize.query.event.EventProcessState;
import org.camunda.optimize.dto.optimize.query.event.EventScopeType;
import org.camunda.optimize.dto.optimize.query.event.EventSourceEntryDto;
import org.camunda.optimize.dto.optimize.rest.EventProcessMappingCreateRequestDto;
import org.camunda.optimize.dto.optimize.rest.event.EventProcessMappingResponseDto;
import org.camunda.optimize.rest.engine.dto.ProcessInstanceEngineDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.camunda.optimize.test.optimize.EventProcessClient.createExternalEventSourceEntry;
import static org.camunda.optimize.test.optimize.EventProcessClient.createSimpleCamundaEventSourceEntry;

public class EventBasedProcessAutogenerationRestServiceIT extends AbstractEventProcessAutogenerationIT {

  @Test
  public void createAutogeneratedProcess_notAuthorized() {
    // given
    embeddedOptimizeExtension.getConfigurationService()
      .getEventBasedProcessConfiguration()
      .getAuthorizedUserIds()
      .clear();

    // when
    Response response = embeddedOptimizeExtension.getRequestExecutor()
      .buildCreateEventProcessMappingRequest(null)
      .execute();

    // then
    assertThat(response.getStatus()).isEqualTo(Response.Status.FORBIDDEN.getStatusCode());
  }

  @Test
  public void createAutogeneratedProcess_noEventSource() {
    // given
    final EventProcessMappingCreateRequestDto createRequestDto =
      buildAutogenerateCreateRequestDto(Collections.emptyList());

    // when
    Response response = embeddedOptimizeExtension.getRequestExecutor()
      .buildCreateEventProcessMappingRequest(createRequestDto)
      .execute();

    // then
    assertThat(response.getStatus()).isEqualTo(Response.Status.BAD_REQUEST.getStatusCode());
  }

  @Test
  public void createAutogeneratedProcess_externalEventSource() {
    // given
    enableProcessingAndTriggerStateTraceProcessing();
    final List<EventSourceEntryDto> externalSource =
      Collections.singletonList(createExternalEventSourceEntry());
    final EventProcessMappingCreateRequestDto createRequestDto = buildAutogenerateCreateRequestDto(externalSource);

    // when
    final EventProcessMappingResponseDto eventProcessMapping =
      autogenerateProcessAndGetMappingResponse(createRequestDto);

    // then
    assertProcessMappingConfiguration(eventProcessMapping, externalSource, EventProcessState.UNMAPPED);
  }

  @Test
  public void createAutogeneratedProcess_externalEventSource_eventImportDisabled() {
    // given
    embeddedOptimizeExtension.getConfigurationService()
      .getEventBasedProcessConfiguration()
      .getEventImport()
      .setEnabled(false);
    final List<EventSourceEntryDto> externalSource =
      Collections.singletonList(createExternalEventSourceEntry());
    final EventProcessMappingCreateRequestDto createRequestDto = buildAutogenerateCreateRequestDto(externalSource);

    // when
    final Response response = embeddedOptimizeExtension.getRequestExecutor()
      .buildCreateEventProcessMappingRequest(createRequestDto)
      .execute();

    // then
    assertThat(response.getStatus()).isEqualTo(Response.Status.BAD_REQUEST.getStatusCode());
  }

  @Test
  public void createAutogeneratedProcess_multipleExternalEventSources() {
    // given
    final EventProcessMappingCreateRequestDto createRequestDto = buildAutogenerateCreateRequestDto(Arrays.asList(
      createExternalEventSourceEntry(),
      createExternalEventSourceEntry()
    ));

    // when
    final Response response = embeddedOptimizeExtension.getRequestExecutor()
      .buildCreateEventProcessMappingRequest(createRequestDto)
      .execute();

    // then
    assertThat(response.getStatus()).isEqualTo(Response.Status.CONFLICT.getStatusCode());
  }

  @Test
  public void createAutogeneratedProcess_camundaEventSource() {
    // given
    final List<EventSourceEntryDto> camundaSource = Collections.singletonList(
      deployAndStartEngineInstanceAndCreateEventSource());
    final EventProcessMappingCreateRequestDto createRequestDto = buildAutogenerateCreateRequestDto(camundaSource);

    // when
    final EventProcessMappingResponseDto eventProcessMapping =
      autogenerateProcessAndGetMappingResponse(createRequestDto);

    // then
    assertProcessMappingConfiguration(eventProcessMapping, camundaSource, EventProcessState.MAPPED);
  }

  @Test
  public void createAutogeneratedProcess_camundaEventSourceImportNotEnabled() {
    // given
    embeddedOptimizeExtension.getDefaultEngineConfiguration().setEventImportEnabled(false);
    final List<EventSourceEntryDto> camundaSource = Collections.singletonList(
      deployAndStartEngineInstanceAndCreateEventSource());
    final EventProcessMappingCreateRequestDto createRequestDto = buildAutogenerateCreateRequestDto(camundaSource);

    // when
    final Response response = eventProcessClient.createCreateEventProcessMappingRequest(createRequestDto).execute();

    // then
    assertThat(response.getStatus()).isEqualTo(Response.Status.BAD_REQUEST.getStatusCode());
  }

  @Test
  public void createAutogeneratedProcess_multipleCamundaEventSources() {
    // given
    final List<EventSourceEntryDto> eventSources = Arrays.asList(
      deployAndStartEngineInstanceAndCreateEventSource(),
      deployAndStartEngineInstanceAndCreateEventSource()
    );
    final EventProcessMappingCreateRequestDto createRequestDto = buildAutogenerateCreateRequestDto(eventSources);

    // when
    final EventProcessMappingResponseDto eventProcessMapping =
      autogenerateProcessAndGetMappingResponse(createRequestDto);

    // then
    assertProcessMappingConfiguration(eventProcessMapping, eventSources, EventProcessState.MAPPED);
  }

  @ParameterizedTest
  @MethodSource("invalidTracingVariables")
  public void createAutogeneratedProcess_multipleCamundaEventSources_noTracingVariableProvided(final String invalidVariable) {
    // given
    final EventSourceEntryDto sourceEntry = createSimpleCamundaEventSourceEntry("someDefinitionKey");
    sourceEntry.setTracedByBusinessKey(false);
    sourceEntry.setTraceVariable(invalidVariable);
    final List<EventSourceEntryDto> eventSources = Arrays.asList(
      sourceEntry,
      deployAndStartEngineInstanceAndCreateEventSource()
    );

    final EventProcessMappingCreateRequestDto createRequestDto = buildAutogenerateCreateRequestDto(eventSources);

    // when
    final Response response = embeddedOptimizeExtension.getRequestExecutor()
      .buildCreateEventProcessMappingRequest(createRequestDto)
      .execute();

    // then
    assertThat(response.getStatus()).isEqualTo(Response.Status.BAD_REQUEST.getStatusCode());
  }

  @Test
  public void createAutogeneratedProcess_camundaAndExternalEventSources() {
    // given
    enableProcessingAndTriggerStateTraceProcessing();
    final List<EventSourceEntryDto> eventSources = Arrays.asList(
      deployAndStartEngineInstanceAndCreateEventSource(),
      createExternalEventSourceEntry()
    );
    final EventProcessMappingCreateRequestDto createRequestDto = buildAutogenerateCreateRequestDto(eventSources);

    // when
    final EventProcessMappingResponseDto eventProcessMapping =
      autogenerateProcessAndGetMappingResponse(createRequestDto);

    // then
    assertProcessMappingConfiguration(eventProcessMapping, eventSources, EventProcessState.MAPPED);
  }

  @Test
  public void createAutogeneratedProcess_invalidExternalEventSourceScope() {
    // given
    final EventSourceEntryDto externalSource = createExternalEventSourceEntry()
      .toBuilder().eventScope(Collections.singletonList(EventScopeType.PROCESS_INSTANCE)).build();
    final EventProcessMappingCreateRequestDto createRequestDto =
      buildAutogenerateCreateRequestDto(Collections.singletonList(externalSource));

    // when
    final Response response = embeddedOptimizeExtension.getRequestExecutor()
      .buildCreateEventProcessMappingRequest(createRequestDto)
      .execute();

    // then
    assertThat(response.getStatus()).isEqualTo(Response.Status.BAD_REQUEST.getStatusCode());
  }

  @Test
  public void createAutogeneratedProcess_invalidCamundaEventSourceScope() {
    // given
    final EventSourceEntryDto camundaSource = deployAndStartEngineInstanceAndCreateEventSource()
      .toBuilder().eventScope(Collections.singletonList(EventScopeType.ALL)).build();
    final EventProcessMappingCreateRequestDto createRequestDto =
      buildAutogenerateCreateRequestDto(Collections.singletonList(camundaSource));

    // when
    final Response response = embeddedOptimizeExtension.getRequestExecutor()
      .buildCreateEventProcessMappingRequest(createRequestDto)
      .execute();

    // then
    assertThat(response.getStatus()).isEqualTo(Response.Status.BAD_REQUEST.getStatusCode());
  }

  private EventSourceEntryDto deployAndStartEngineInstanceAndCreateEventSource() {
    final ProcessInstanceEngineDto processInstanceEngineDto =
      deployAndStartProcessWithVariables(Collections.emptyMap());
    importEngineEntities();
    return createCamundaSourceEntry(
      processInstanceEngineDto.getProcessDefinitionKey(),
      EventScopeType.PROCESS_INSTANCE
    );
  }

  private void enableProcessingAndTriggerStateTraceProcessing() {
    embeddedOptimizeExtension.getConfigurationService()
      .getEventBasedProcessConfiguration()
      .getEventImport()
      .setEnabled(true);
    processEventCountAndTraces();
  }

  private static Stream<String> invalidTracingVariables() {
    return Stream.of(null, "");
  }

}
