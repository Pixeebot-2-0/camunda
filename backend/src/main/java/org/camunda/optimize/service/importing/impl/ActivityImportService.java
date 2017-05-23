package org.camunda.optimize.service.importing.impl;

import org.camunda.optimize.dto.engine.HistoricActivityInstanceEngineDto;
import org.camunda.optimize.dto.optimize.importing.EventDto;
import org.camunda.optimize.service.es.writer.EventsWriter;
import org.camunda.optimize.service.exceptions.OptimizeException;
import org.camunda.optimize.service.importing.diff.MissingActivityFinder;
import org.camunda.optimize.service.importing.diff.MissingEntitiesFinder;
import org.camunda.optimize.service.importing.job.importing.EventImportJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author Askar Akhmerov
 */
@Component
public class ActivityImportService extends PaginatedImportService<HistoricActivityInstanceEngineDto, EventDto> {

  private final Logger logger = LoggerFactory.getLogger(ActivityImportService.class);

  @Autowired
  private EventsWriter eventsWriter;
  @Autowired
  private MissingActivityFinder missingActivityFinder;

  @Override
  protected MissingEntitiesFinder<HistoricActivityInstanceEngineDto> getMissingEntitiesFinder() {
    return missingActivityFinder;
  }

  @Override
  protected List<HistoricActivityInstanceEngineDto> queryEngineRestPoint() {
    return importStrategy.fetchHistoricActivityInstances();
  }

  @Override
  public int getEngineEntityCount() throws OptimizeException {
    return importStrategy.fetchHistoricActivityInstanceCount();
  }

  @Override
  public void importToElasticSearch(List<EventDto> events) {
    EventImportJob eventImportJob = new EventImportJob(eventsWriter);
    eventImportJob.setEntitiesToImport(events);
    try {
      importJobExecutor.executeImportJob(eventImportJob);
    } catch (InterruptedException e) {
      logger.error("Interruption during import of activity job!", e);
    }
  }

  @Override
  public EventDto mapToOptimizeDto(HistoricActivityInstanceEngineDto entry) {
    final EventDto createEvent = new EventDto();
    mapDefaults(entry, createEvent);
    return createEvent;
  }

  protected void prepareDataForPostProcessing(HistoricActivityInstanceEngineDto entry) {
    this.idsForPostProcessing.add(entry.getProcessInstanceId());
  }

  private void mapDefaults(HistoricActivityInstanceEngineDto dto, EventDto createEvent) {
    createEvent.setId(dto.getId());
    createEvent.setActivityId(dto.getActivityId());
    createEvent.setActivityInstanceId(dto.getParentActivityInstanceId());
    createEvent.setTimestamp(dto.getStartTime());
    createEvent.setProcessDefinitionKey(dto.getProcessDefinitionKey());
    createEvent.setProcessDefinitionId(dto.getProcessDefinitionId());
    createEvent.setProcessInstanceId(dto.getProcessInstanceId());
    createEvent.setStartDate(dto.getStartTime());
    createEvent.setEndDate(dto.getEndTime());
    createEvent.setActivityType(dto.getActivityType());
    createEvent.setDurationInMs(dto.getDurationInMillis());
  }

  @Override
  public String getElasticsearchType() {
    return configurationService.getEventType();
  }

  @Override
  protected Set<String> getIdsForPostProcessing() {
    if (idsForPostProcessing == null || idsForPostProcessing.isEmpty() || currentHpiContainsOnlyNullElement()) {
      return null;
    }
    return new HashSet<>(idsForPostProcessing);
  }

  private boolean currentHpiContainsOnlyNullElement() {
    return idsForPostProcessing.size() == 1 && idsForPostProcessing.contains(null);
  }
}
