package org.camunda.optimize.service.es.report.avg;

import org.camunda.bpm.model.bpmn.Bpmn;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.optimize.dto.optimize.query.IdDto;
import org.camunda.optimize.dto.optimize.query.report.GroupByDto;
import org.camunda.optimize.dto.optimize.query.report.ReportDataDto;
import org.camunda.optimize.dto.optimize.query.report.ReportDefinitionDto;
import org.camunda.optimize.dto.optimize.query.report.ViewDto;
import org.camunda.optimize.dto.optimize.query.report.filter.DateFilterDto;
import org.camunda.optimize.dto.optimize.query.report.filter.ExecutedFlowNodeFilterDto;
import org.camunda.optimize.dto.optimize.query.report.filter.FilterDto;
import org.camunda.optimize.dto.optimize.query.report.filter.VariableFilterDto;
import org.camunda.optimize.dto.optimize.query.report.filter.data.DateFilterDataDto;
import org.camunda.optimize.dto.optimize.query.report.filter.data.VariableFilterDataDto;
import org.camunda.optimize.dto.optimize.query.report.filter.util.ExecutedFlowNodeFilterBuilder;
import org.camunda.optimize.dto.optimize.query.report.result.MapReportResultDto;
import org.camunda.optimize.rest.engine.dto.ProcessInstanceEngineDto;
import org.camunda.optimize.test.it.rule.ElasticSearchIntegrationTestRule;
import org.camunda.optimize.test.it.rule.EmbeddedOptimizeRule;
import org.camunda.optimize.test.it.rule.EngineDatabaseRule;
import org.camunda.optimize.test.it.rule.EngineIntegrationRule;
import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.RuleChain;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.sql.SQLException;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.camunda.optimize.service.es.report.command.util.ReportConstants.DATE_UNIT_DAY;
import static org.camunda.optimize.service.es.report.command.util.ReportConstants.DATE_UNIT_HOUR;
import static org.camunda.optimize.service.es.report.command.util.ReportConstants.DATE_UNIT_MONTH;
import static org.camunda.optimize.service.es.report.command.util.ReportConstants.DATE_UNIT_WEEK;
import static org.camunda.optimize.service.es.report.command.util.ReportConstants.DATE_UNIT_YEAR;
import static org.camunda.optimize.service.es.report.command.util.ReportConstants.GROUP_BY_START_DATE_TYPE;
import static org.camunda.optimize.service.es.report.command.util.ReportConstants.VIEW_AVERAGE_OPERATION;
import static org.camunda.optimize.service.es.report.command.util.ReportConstants.VIEW_DURATION_PROPERTY;
import static org.camunda.optimize.service.es.report.command.util.ReportConstants.VIEW_PROCESS_INSTANCE_ENTITY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsNull.notNullValue;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"/it/it-applicationContext.xml"})
public class AverageProcessInstanceDurationByStartDateReportEvaluationIT {

  public EngineIntegrationRule engineRule = new EngineIntegrationRule();
  public ElasticSearchIntegrationTestRule elasticSearchRule = new ElasticSearchIntegrationTestRule();
  public EmbeddedOptimizeRule embeddedOptimizeRule = new EmbeddedOptimizeRule();
  public EngineDatabaseRule engineDatabaseRule = new EngineDatabaseRule();

  private static final String TEST_ACTIVITY = "testActivity";

  @Rule
  public RuleChain chain = RuleChain
    .outerRule(elasticSearchRule).around(engineRule).around(embeddedOptimizeRule).around(engineDatabaseRule);

  @Test
  public void simpleReportEvaluation() throws Exception {
    // given
    LocalDateTime startDate = LocalDateTime.now();
    ProcessInstanceEngineDto processInstanceDto = deployAndStartSimpleServiceTaskProcess();
    adjustProcessInstanceDates(processInstanceDto.getId(), startDate, 0L, 1L);
    embeddedOptimizeRule.scheduleAllJobsAndImportEngineEntities();
    elasticSearchRule.refreshOptimizeIndexInElasticsearch();

    // when
    String processDefinitionId = processInstanceDto.getDefinitionId();
    ReportDataDto reportData = createDefaultReportData(processDefinitionId, DATE_UNIT_DAY);
    MapReportResultDto result = evaluateReport(reportData);

    // then
    ReportDataDto resultReportDataDto = result.getData();
    assertThat(resultReportDataDto.getProcessDefinitionId(), is(processDefinitionId));
    assertThat(resultReportDataDto.getView(), is(notNullValue()));
    assertThat(resultReportDataDto.getView().getOperation(), is(VIEW_AVERAGE_OPERATION));
    assertThat(resultReportDataDto.getView().getEntity(), is(VIEW_PROCESS_INSTANCE_ENTITY));
    assertThat(resultReportDataDto.getView().getProperty(), is(VIEW_DURATION_PROPERTY));
    assertThat(resultReportDataDto.getGroupBy().getType(), is(GROUP_BY_START_DATE_TYPE));
    assertThat(resultReportDataDto.getGroupBy().getUnit(), is(DATE_UNIT_DAY));
    assertThat(result.getResult(), is(notNullValue()));
    assertThat(result.getResult().size(), is(1));
    Map<String, Long> resultMap = result.getResult();
    LocalDateTime startOfToday = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
    assertThat(resultMap.containsKey(localDateTimeToString(startOfToday)), is(true));
    assertThat(resultMap.get(localDateTimeToString(startOfToday)), is(1000L));
  }

  @Test
  public void simpleReportEvaluationById() throws Exception {
    // given
    LocalDateTime startDate = LocalDateTime.now();
    ProcessInstanceEngineDto processInstanceDto = deployAndStartSimpleServiceTaskProcess();
    adjustProcessInstanceDates(processInstanceDto.getId(), startDate, 0L, 1L);
    String processDefinitionId = processInstanceDto.getDefinitionId();
    embeddedOptimizeRule.scheduleAllJobsAndImportEngineEntities();
    elasticSearchRule.refreshOptimizeIndexInElasticsearch();
    String reportId = createAndStoreDefaultReportDefinition(processDefinitionId, DATE_UNIT_DAY);

    // when
    MapReportResultDto result = evaluateReportById(reportId);

    // then
     ReportDataDto resultReportDataDto = result.getData();
    assertThat(resultReportDataDto.getProcessDefinitionId(), is(processDefinitionId));
    assertThat(resultReportDataDto.getView(), is(notNullValue()));
    assertThat(resultReportDataDto.getView().getOperation(), is(VIEW_AVERAGE_OPERATION));
    assertThat(resultReportDataDto.getView().getEntity(), is(VIEW_PROCESS_INSTANCE_ENTITY));
    assertThat(resultReportDataDto.getView().getProperty(), is(VIEW_DURATION_PROPERTY));
    assertThat(resultReportDataDto.getGroupBy().getType(), is(GROUP_BY_START_DATE_TYPE));
    assertThat(resultReportDataDto.getGroupBy().getUnit(), is(DATE_UNIT_DAY));
    assertThat(result.getResult(), is(notNullValue()));
    assertThat(result.getResult().size(), is(1));
    Map<String, Long> resultMap = result.getResult();
    LocalDateTime startOfToday = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
    assertThat(resultMap.containsKey(localDateTimeToString(startOfToday)), is(true));
    assertThat(resultMap.get(localDateTimeToString(startOfToday)), is(1000L));
  }

  @Test
  public void processInstancesStartedAtSameIntervalAreGroupedTogether() throws Exception {
    // given
    LocalDateTime startDate = LocalDateTime.now();
    ProcessInstanceEngineDto processInstanceDto = deployAndStartSimpleServiceTaskProcess();
    adjustProcessInstanceDates(processInstanceDto.getId(), startDate, 0L, 1L);
    processInstanceDto = engineRule.startProcessInstance(processInstanceDto.getDefinitionId());
    adjustProcessInstanceDates(processInstanceDto.getId(), startDate, 0L, 3L);
    ProcessInstanceEngineDto processInstanceDto3 =
      engineRule.startProcessInstance(processInstanceDto.getDefinitionId());
    adjustProcessInstanceDates(processInstanceDto3.getId(), startDate, -1L, 1L);


    embeddedOptimizeRule.scheduleAllJobsAndImportEngineEntities();
    elasticSearchRule.refreshOptimizeIndexInElasticsearch();

    // when
    String processDefinitionId = processInstanceDto.getDefinitionId();
    ReportDataDto reportData = createDefaultReportData(processDefinitionId, DATE_UNIT_DAY);
    MapReportResultDto result = evaluateReport(reportData);

    // then
    Map<String, Long> resultMap = result.getResult();
    assertThat(resultMap.size(), is(2));
    LocalDateTime startOfToday = startDate.truncatedTo(ChronoUnit.DAYS);
    String expectedStringToday = localDateTimeToString(startOfToday);
    assertThat(resultMap.containsKey(expectedStringToday), is(true));
    assertThat(resultMap.get(expectedStringToday), is(2000L));
    String expectedStringYesterday = localDateTimeToString(startOfToday.minusDays(1));
    assertThat(resultMap.containsKey(expectedStringYesterday), is(true));
    assertThat(resultMap.get(expectedStringYesterday), is(1000L));
  }

  @Test
  public void resultIsSortedInDescendingOrder() throws Exception {
    // given
    LocalDateTime startDate = LocalDateTime.now();
    ProcessInstanceEngineDto processInstanceDto = deployAndStartSimpleServiceTaskProcess();
    adjustProcessInstanceDates(processInstanceDto.getId(), startDate, 0L, 1L);
    processInstanceDto = engineRule.startProcessInstance(processInstanceDto.getDefinitionId());
    adjustProcessInstanceDates(processInstanceDto.getId(), startDate, -2L, 3L);
    ProcessInstanceEngineDto processInstanceDto3 =
      engineRule.startProcessInstance(processInstanceDto.getDefinitionId());
    adjustProcessInstanceDates(processInstanceDto3.getId(), startDate, -1L, 1L);


    embeddedOptimizeRule.scheduleAllJobsAndImportEngineEntities();
    elasticSearchRule.refreshOptimizeIndexInElasticsearch();

    // when
    String processDefinitionId = processInstanceDto.getDefinitionId();
    ReportDataDto reportData = createDefaultReportData(processDefinitionId, DATE_UNIT_DAY);
    MapReportResultDto result = evaluateReport(reportData);

    // then
    Map<String, Long> resultMap = result.getResult();
    assertThat(resultMap.size(), is(3));
    assertThat(new ArrayList<>(resultMap.keySet()), isInDescendingOrdering());
  }

  private Matcher<? super List<String>> isInDescendingOrdering()
  {
    return new TypeSafeMatcher<List<String>>()
    {
      @Override
      public void describeTo (Description description)
      {
        description.appendText("The given list should be sorted in  order!");
      }

      @Override
      protected boolean matchesSafely (List<String> item)
      {
        for(int i = (item.size() - 1) ; i > 0; i--) {
          if(item.get(i).compareTo(item.get(i-1)) < 1) return false;
        }
        return true;
      }
    };
  }

  private void adjustProcessInstanceDates(String processInstanceId,
                                          LocalDateTime startDate,
                                          long daysToShift,
                                          long durationInSec) throws SQLException {
    LocalDateTime shiftedStartDate = startDate.plusDays(daysToShift);
    engineDatabaseRule.changeProcessInstanceStartDate(processInstanceId, shiftedStartDate);
    engineDatabaseRule.changeProcessInstanceEndDate(processInstanceId, shiftedStartDate.plusSeconds(durationInSec));
  }

  @Test
  public void emptyIntervalBetweenTwoProcessInstances() throws Exception {
    // given
    LocalDateTime startDate = LocalDateTime.now();
    ProcessInstanceEngineDto processInstanceDto = deployAndStartSimpleServiceTaskProcess();
    adjustProcessInstanceDates(processInstanceDto.getId(), startDate, 0L, 1L);
    processInstanceDto = engineRule.startProcessInstance(processInstanceDto.getDefinitionId());
    adjustProcessInstanceDates(processInstanceDto.getId(), startDate, 0L, 3L);
    ProcessInstanceEngineDto processInstanceDto3 =
      engineRule.startProcessInstance(processInstanceDto.getDefinitionId());
    adjustProcessInstanceDates(processInstanceDto3.getId(), startDate, -2L, 1L);

    embeddedOptimizeRule.scheduleAllJobsAndImportEngineEntities();
    elasticSearchRule.refreshOptimizeIndexInElasticsearch();

    // when
    String processDefinitionId = processInstanceDto.getDefinitionId();
    ReportDataDto reportData = createDefaultReportData(processDefinitionId, DATE_UNIT_DAY);
    MapReportResultDto result = evaluateReport(reportData);

    // then
    Map<String, Long> resultMap = result.getResult();
    assertThat(resultMap.size(), is(3));
    LocalDateTime startOfToday = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
    String expectedStringToday = localDateTimeToString(startOfToday);
    assertThat(resultMap.containsKey(expectedStringToday), is(true));
    assertThat(resultMap.get(expectedStringToday), is(2000L));
    String expectedStringYesterday = localDateTimeToString(startOfToday.minusDays(1));
    assertThat(resultMap.containsKey(expectedStringYesterday), is(true));
    assertThat(resultMap.get(expectedStringYesterday), is(0L));
    String expectedStringDayBeforeYesterday = localDateTimeToString(startOfToday.minusDays(2));
    assertThat(resultMap.containsKey(expectedStringDayBeforeYesterday), is(true));
    assertThat(resultMap.get(expectedStringDayBeforeYesterday), is(1000L));
  }

  @Test
  public void averageGroupedByHour() throws Exception {
    // given
    List<ProcessInstanceEngineDto> processInstanceDtos = deployAndStartSimpleProcesses(5);
    LocalDateTime now = LocalDateTime.now();
    updateProcessInstancesDates(processInstanceDtos, now, ChronoUnit.HOURS);
    embeddedOptimizeRule.scheduleAllJobsAndImportEngineEntities();
    elasticSearchRule.refreshOptimizeIndexInElasticsearch();

    // when
    String processDefinitionId = processInstanceDtos.get(0).getDefinitionId();
    ReportDataDto reportData = createDefaultReportData(processDefinitionId, DATE_UNIT_HOUR);
    MapReportResultDto result = evaluateReport(reportData);

    // then
    assertThat(result.getResult(), is(notNullValue()));
    Map<String, Long> resultMap = result.getResult();
    assertDateResultMap(resultMap, 5, now, ChronoUnit.HOURS);
  }

  private void assertDateResultMap(Map<String, Long> resultMap, int size, LocalDateTime now, ChronoUnit unit) {
    assertThat(resultMap.size(), is(size));
    final LocalDateTime finalStartOfUnit = truncateToStartOfUnit(now, unit);
    IntStream.range(0, size)
      .forEach(i -> {
        String expectedDateString = localDateTimeToString(finalStartOfUnit.minus(i, unit));
        assertThat(resultMap.containsKey(expectedDateString), is(true));
        assertThat(resultMap.get(expectedDateString), is(1000L));
      });
  }

  private LocalDateTime truncateToStartOfUnit(LocalDateTime date, ChronoUnit unit) {
    LocalDateTime truncatedDate;
    if (unit.equals(ChronoUnit.HOURS) || unit.equals(ChronoUnit.DAYS)) {
      truncatedDate = date.truncatedTo(unit);
    } else if (unit.equals(ChronoUnit.WEEKS)) {
      truncatedDate = date.with(DayOfWeek.MONDAY).truncatedTo(ChronoUnit.DAYS);
    } else if (unit.equals(ChronoUnit.MONTHS)){
      truncatedDate = date.withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS);
    } else {
      // it should be year
      truncatedDate = date.withDayOfYear(1).truncatedTo(ChronoUnit.DAYS);
    }
    return truncatedDate;
  }

  private void updateProcessInstancesDates(List<ProcessInstanceEngineDto> procInsts,
                                           LocalDateTime now,
                                           ChronoUnit unit) throws SQLException {
    Map<String, LocalDateTime> idToNewStartDate = new HashMap<>();
    Map<String, LocalDateTime> idToNewEndDate = new HashMap<>();
    IntStream.range(0, procInsts.size())
      .forEach( i -> {
        String id = procInsts.get(i).getId();
        LocalDateTime newStartDate = now.minus(i, unit);
        idToNewStartDate.put(id, newStartDate);
        idToNewEndDate.put(id, newStartDate.plusSeconds(1L));
      });
    engineDatabaseRule.updateProcessInstanceStartDates(idToNewStartDate);
    engineDatabaseRule.updateProcessInstanceEndDates(idToNewEndDate);
  }

  @Test
  public void averageGroupedByDay() throws Exception {
    // given
    List<ProcessInstanceEngineDto> processInstanceDtos = deployAndStartSimpleProcesses(8);
    LocalDateTime now = LocalDateTime.now();
    updateProcessInstancesDates(processInstanceDtos, now, ChronoUnit.DAYS);
    embeddedOptimizeRule.scheduleAllJobsAndImportEngineEntities();
    elasticSearchRule.refreshOptimizeIndexInElasticsearch();

    // when
    String processDefinitionId = processInstanceDtos.get(0).getDefinitionId();
    ReportDataDto reportData = createDefaultReportData(processDefinitionId, DATE_UNIT_DAY);
    MapReportResultDto result = evaluateReport(reportData);

    // then
    assertThat(result.getResult(), is(notNullValue()));
    Map<String, Long> resultMap = result.getResult();
    assertDateResultMap(resultMap, 8, now, ChronoUnit.DAYS);
  }

  @Test
  public void averageGroupedByWeek() throws Exception {
    // given
    List<ProcessInstanceEngineDto> processInstanceDtos = deployAndStartSimpleProcesses(8);
    LocalDateTime now = LocalDateTime.now();
    updateProcessInstancesDates(processInstanceDtos, now, ChronoUnit.WEEKS);
    embeddedOptimizeRule.scheduleAllJobsAndImportEngineEntities();
    elasticSearchRule.refreshOptimizeIndexInElasticsearch();

    // when
    String processDefinitionId = processInstanceDtos.get(0).getDefinitionId();
    ReportDataDto reportData = createDefaultReportData(processDefinitionId, DATE_UNIT_WEEK);
    MapReportResultDto result = evaluateReport(reportData);

    // then
    assertThat(result.getResult(), is(notNullValue()));
    Map<String, Long> resultMap = result.getResult();
    assertDateResultMap(resultMap, 8, now, ChronoUnit.WEEKS);
  }

  @Test
  public void averageGroupedByMonth() throws Exception {
    // given
    List<ProcessInstanceEngineDto> processInstanceDtos = deployAndStartSimpleProcesses(8);
    LocalDateTime now = LocalDateTime.now();
    updateProcessInstancesDates(processInstanceDtos, now, ChronoUnit.MONTHS);
    embeddedOptimizeRule.scheduleAllJobsAndImportEngineEntities();
    elasticSearchRule.refreshOptimizeIndexInElasticsearch();

    // when
    String processDefinitionId = processInstanceDtos.get(0).getDefinitionId();
    ReportDataDto reportData = createDefaultReportData(processDefinitionId, DATE_UNIT_MONTH);
    MapReportResultDto result = evaluateReport(reportData);

    // then
    assertThat(result.getResult(), is(notNullValue()));
    Map<String, Long> resultMap = result.getResult();
    assertDateResultMap(resultMap, 8, now, ChronoUnit.MONTHS);
  }

  @Test
  public void averageGroupedByYear() throws Exception {
    // given
    List<ProcessInstanceEngineDto> processInstanceDtos = deployAndStartSimpleProcesses(8);
    LocalDateTime now = LocalDateTime.now();
    updateProcessInstancesDates(processInstanceDtos, now, ChronoUnit.YEARS);
    embeddedOptimizeRule.scheduleAllJobsAndImportEngineEntities();
    elasticSearchRule.refreshOptimizeIndexInElasticsearch();

    // when
    String processDefinitionId = processInstanceDtos.get(0).getDefinitionId();
    ReportDataDto reportData = createDefaultReportData(processDefinitionId, DATE_UNIT_YEAR);
    MapReportResultDto result = evaluateReport(reportData);

    // then
    assertThat(result.getResult(), is(notNullValue()));
    Map<String, Long> resultMap = result.getResult();
    assertDateResultMap(resultMap, 8, now, ChronoUnit.YEARS);
  }

  @Test
  public void otherProcessDefinitionsDoNoAffectResult() throws Exception {
    // given
    LocalDateTime startDate = LocalDateTime.now().minusDays(2);
    ProcessInstanceEngineDto processInstanceDto = deployAndStartSimpleServiceTaskProcess();
    adjustProcessInstanceDates(processInstanceDto.getId(), startDate, 0L, 1L);
    deployAndStartSimpleServiceTaskProcess();
    embeddedOptimizeRule.scheduleAllJobsAndImportEngineEntities();
    elasticSearchRule.refreshOptimizeIndexInElasticsearch();

    // when
    String processDefinitionId = processInstanceDto.getDefinitionId();
    ReportDataDto reportData = createDefaultReportData(processDefinitionId, DATE_UNIT_DAY);
    MapReportResultDto result = evaluateReport(reportData);

    // then
    Map<String, Long> resultMap = result.getResult();
    LocalDateTime startOfToday = startDate.truncatedTo(ChronoUnit.DAYS);
    String expectedStartDateString = localDateTimeToString(startOfToday);
    assertThat(resultMap.size(), is(1));
    assertThat(resultMap.containsKey(expectedStartDateString), is(true));
    assertThat(resultMap.get(expectedStartDateString), is(1000L));
  }

  @Test
  public void dateFilterInReport() throws Exception {
    // given
    LocalDateTime startDate = LocalDateTime.now();
    ProcessInstanceEngineDto processInstanceDto = deployAndStartSimpleServiceTaskProcess();
    adjustProcessInstanceDates(processInstanceDto.getId(), startDate, 0L, 1L);
    Date past = engineRule.getHistoricProcessInstance(processInstanceDto.getId()).getStartTime();
    String processDefinitionId = processInstanceDto.getDefinitionId();
    embeddedOptimizeRule.scheduleAllJobsAndImportEngineEntities();
    elasticSearchRule.refreshOptimizeIndexInElasticsearch();

    // when
    ReportDataDto reportData = createDefaultReportData(processDefinitionId, DATE_UNIT_DAY);
    reportData.setFilter(createDateFilter("<", "start_date", past));
    MapReportResultDto result = evaluateReport(reportData);

    // then
    assertThat(result.getResult(), is(notNullValue()));
    assertThat(result.getResult().size(), is(0));

    // when
    reportData = createDefaultReportData(processDefinitionId, DATE_UNIT_DAY);
    reportData.setFilter(createDateFilter(">=", "start_date", past));
    result = evaluateReport(reportData);

    // then
    assertThat(result.getResult(), is(notNullValue()));
    assertThat(result.getResult().size(), is(1));
  }


  public List<FilterDto> createDateFilter(String operator, String type, Date dateValue) {
    DateFilterDataDto date = new DateFilterDataDto();
    date.setOperator(operator);
    date.setType(type);
    date.setValue(dateValue);

    DateFilterDto dateFilterDto = new DateFilterDto();
    dateFilterDto.setData(date);
    return Collections.singletonList(dateFilterDto);
  }

  @Test
  public void variableFilterInReport() throws Exception {
    // given
    Map<String, Object> variables = new HashMap<>();
    variables.put("var", true);
    LocalDateTime startDate = LocalDateTime.now();
    ProcessInstanceEngineDto processInstanceDto = deployAndStartSimpleServiceTaskProcessWithVariables(variables);
    adjustProcessInstanceDates(processInstanceDto.getId(), startDate, 0L, 1L);
    String processDefinitionId = processInstanceDto.getDefinitionId();
    engineRule.startProcessInstance(processDefinitionId);
    embeddedOptimizeRule.scheduleAllJobsAndImportEngineEntities();
    elasticSearchRule.refreshOptimizeIndexInElasticsearch();

    // when
    ReportDataDto reportData = createDefaultReportData(processDefinitionId, DATE_UNIT_DAY);
    reportData.setFilter(createVariableFilter());
    MapReportResultDto result = evaluateReport(reportData);

    // then
    assertThat(result.getResult(), is(notNullValue()));
    assertThat(result.getResult().size(), is(1));
  }

  private List<FilterDto> createVariableFilter() {
    VariableFilterDataDto data = new VariableFilterDataDto();
    data.setName("var");
    data.setType("boolean");
    data.setOperator("=");
    data.setValues(Collections.singletonList("true"));

    VariableFilterDto variableFilterDto = new VariableFilterDto();
    variableFilterDto.setData(data);
    return Collections.singletonList(variableFilterDto);
  }

  @Test
  public void flowNodeFilterInReport() throws Exception {
    // given
    Map<String, Object> variables = new HashMap<>();
    variables.put("goToTask1", true);
    String processDefinitionId = deploySimpleGatewayProcessDefinition();
    ProcessInstanceEngineDto processInstanceDto = engineRule.startProcessInstance(processDefinitionId, variables);
    adjustProcessInstanceDates(processInstanceDto.getId(), LocalDateTime.now(), 0L, 1L);
    variables.put("goToTask1", false);
    engineRule.startProcessInstance(processDefinitionId, variables);
    embeddedOptimizeRule.scheduleAllJobsAndImportEngineEntities();
    elasticSearchRule.refreshOptimizeIndexInElasticsearch();

    // when
    ReportDataDto reportData = createDefaultReportData(processDefinitionId, DATE_UNIT_DAY);
    List<ExecutedFlowNodeFilterDto> flowNodeFilter = ExecutedFlowNodeFilterBuilder.construct()
          .id("task1")
          .build();
    reportData.getFilter().addAll(flowNodeFilter);
    MapReportResultDto result = evaluateReport(reportData);

    // then
    assertThat(result.getResult(), is(notNullValue()));
    assertThat(result.getResult().size(), is(1));
  }

  @Test
  public void optimizeExceptionOnGroupByTypeIsNull() throws Exception {
    // given
    ReportDataDto dataDto = createDefaultReportData("123", DATE_UNIT_DAY);
    dataDto.getGroupBy().setType(null);

    //when
    Response response = evaluateReportAndReturnResponse(dataDto);

    // then
    assertThat(response.getStatus(), is(500));
  }

  @Test
  public void optimizeExceptionOnGroupByUnitIsNull() throws Exception {
    // given
    ReportDataDto dataDto = createDefaultReportData("123", DATE_UNIT_DAY);
    dataDto.getGroupBy().setUnit(null);

    //when
    Response response = evaluateReportAndReturnResponse(dataDto);

    // then
    assertThat(response.getStatus(), is(500));
  }

  private ProcessInstanceEngineDto deployAndStartSimpleServiceTaskProcess() throws IOException {
    return deployAndStartSimpleProcesses(1).get(0);
  }

  private List<ProcessInstanceEngineDto> deployAndStartSimpleProcesses(int number) throws IOException {
    String processDefinitionId = deploySimpleServiceTaskProcess();
    return IntStream.range(0, number)
      .mapToObj( i -> engineRule.startProcessInstance(processDefinitionId))
      .collect(Collectors.toList());
  }

  private String deploySimpleServiceTaskProcess() throws IOException {
    BpmnModelInstance processModel = Bpmn.createExecutableProcess("aProcess")
      .name("aProcessName")
      .startEvent()
      .serviceTask()
      .camundaExpression("${true}")
      .endEvent()
      .done();
    return engineRule.deployProcessAndGetId(processModel);
  }

  private ProcessInstanceEngineDto deployAndStartSimpleServiceTaskProcessWithVariables(Map<String, Object> variables) {
    return deployAndStartSimpleServiceTaskProcessWithVariables(TEST_ACTIVITY, variables);
  }

  private ProcessInstanceEngineDto deployAndStartSimpleServiceTaskProcessWithVariables(String activityId,
                                                                                       Map<String, Object> variables) {
    BpmnModelInstance processModel = Bpmn.createExecutableProcess("aProcess")
      .name("aProcessName")
      .startEvent()
      .serviceTask(activityId)
      .camundaExpression("${true}")
      .endEvent()
      .done();
    return engineRule.deployAndStartProcessWithVariables(processModel, variables);
  }

  private String deploySimpleGatewayProcessDefinition() throws Exception {
    BpmnModelInstance modelInstance = Bpmn.createExecutableProcess()
      .startEvent("startEvent")
      .exclusiveGateway("splittingGateway")
        .name("Should we go to task 1?")
        .condition("yes", "${goToTask1}")
        .serviceTask("task1")
          .camundaExpression("${true}")
      .exclusiveGateway("mergeGateway")
        .endEvent("endEvent")
      .moveToNode("splittingGateway")
        .condition("no", "${!goToTask1}")
        .serviceTask("task2")
          .camundaExpression("${true}")
        .connectTo("mergeGateway")
      .done();
    String processDefinitionId = engineRule.deployProcessAndGetId(modelInstance);
    return processDefinitionId;
  }

  private String createNewReport() {
    String token = embeddedOptimizeRule.getAuthenticationToken();
    Response response =
      embeddedOptimizeRule.target("report")
        .request()
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
        .post(Entity.json(""));
    assertThat(response.getStatus(), is(200));

    return response.readEntity(IdDto.class).getId();
  }

  private void updateReport(String id, ReportDefinitionDto updatedReport) {
    String token = embeddedOptimizeRule.getAuthenticationToken();
    Response response =
      embeddedOptimizeRule.target("report/" + id)
        .request()
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
        .put(Entity.json(updatedReport));
    assertThat(response.getStatus(), is(204));
  }

  private String createAndStoreDefaultReportDefinition(String processDefinitionId, String dateInterval) {
    String id = createNewReport();
    ReportDataDto reportData = createDefaultReportData(processDefinitionId, dateInterval);
    ReportDefinitionDto report = new ReportDefinitionDto();
    report.setData(reportData);
    report.setId(id);
    report.setLastModifier("something");
    report.setName("something");
    report.setCreated(LocalDateTime.now());
    report.setLastModified(LocalDateTime.now());
    report.setOwner("something");
    updateReport(id, report);
    return id;
  }

  private MapReportResultDto evaluateReportById(String reportId) {
    String token = embeddedOptimizeRule.getAuthenticationToken();
    Response response = embeddedOptimizeRule.target("report/" + reportId + "/evaluate")
      .request()
      .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
      .get();
    assertThat(response.getStatus(), is(200));

    return response.readEntity(MapReportResultDto.class);
  }

  private String localDateTimeToString(LocalDateTime time) {
    return embeddedOptimizeRule.getDateTimeFormatter().format(time);
  }

  private ReportDataDto createDefaultReportData(String processDefinitionId, String dateInterval) {
    ReportDataDto reportData = new ReportDataDto();
    reportData.setProcessDefinitionId(processDefinitionId);
    reportData.setVisualization("table");
    ViewDto view = new ViewDto();
    view.setOperation(VIEW_AVERAGE_OPERATION);
    view.setEntity(VIEW_PROCESS_INSTANCE_ENTITY);
    view.setProperty(VIEW_DURATION_PROPERTY);
    reportData.setView(view);
    GroupByDto groupByDto = new GroupByDto();
    groupByDto.setType(GROUP_BY_START_DATE_TYPE);
    groupByDto.setUnit(dateInterval);
    reportData.setGroupBy(groupByDto);
    return reportData;
  }

  private MapReportResultDto evaluateReport(ReportDataDto reportData) {
    Response response = evaluateReportAndReturnResponse(reportData);
    assertThat(response.getStatus(), is(200));

    return response.readEntity(MapReportResultDto.class);
  }

  private Response evaluateReportAndReturnResponse(ReportDataDto reportData) {
    String token = embeddedOptimizeRule.getAuthenticationToken();
    return embeddedOptimizeRule.target("report/evaluate")
      .request()
      .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
      .post(Entity.json(reportData));
  }


}
