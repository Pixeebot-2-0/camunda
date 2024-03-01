/*
 * Copyright Camunda Services GmbH
 *
 * BY INSTALLING, DOWNLOADING, ACCESSING, USING, OR DISTRIBUTING THE SOFTWARE, YOU INDICATE YOUR ACCEPTANCE TO AND ARE ENTERING INTO A CONTRACT WITH, THE LICENSOR ON THE TERMS SET OUT IN THIS AGREEMENT. IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT USE THE SOFTWARE. IF YOU ARE RECEIVING THE SOFTWARE ON BEHALF OF A LEGAL ENTITY, YOU REPRESENT AND WARRANT THAT YOU HAVE THE ACTUAL AUTHORITY TO AGREE TO THE TERMS AND CONDITIONS OF THIS AGREEMENT ON BEHALF OF SUCH ENTITY.
 * “Licensee” means you, an individual, or the entity on whose behalf you receive the Software.
 *
 * Permission is hereby granted, free of charge, to the Licensee obtaining a copy of this Software and associated documentation files to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject in each case to the following conditions:
 * Condition 1: If the Licensee distributes the Software or any derivative works of the Software, the Licensee must attach this Agreement.
 * Condition 2: Without limiting other conditions in this Agreement, the grant of rights is solely for non-production use as defined below.
 * "Non-production use" means any use of the Software that is not directly related to creating products, services, or systems that generate revenue or other direct or indirect economic benefits.  Examples of permitted non-production use include personal use, educational use, research, and development. Examples of prohibited production use include, without limitation, use for commercial, for-profit, or publicly accessible systems or use for commercial or revenue-generating purposes.
 *
 * If the Licensee is in breach of the Conditions, this Agreement, including the rights granted under it, will automatically terminate with immediate effect.
 *
 * SUBJECT AS SET OUT BELOW, THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * NOTHING IN THIS AGREEMENT EXCLUDES OR RESTRICTS A PARTY’S LIABILITY FOR (A) DEATH OR PERSONAL INJURY CAUSED BY THAT PARTY’S NEGLIGENCE, (B) FRAUD, OR (C) ANY OTHER LIABILITY TO THE EXTENT THAT IT CANNOT BE LAWFULLY EXCLUDED OR RESTRICTED.
 */
package io.camunda.operate.webapp.api.v1.dao.elasticsearch;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import io.camunda.operate.connect.OperateDateTimeFormatter;
import io.camunda.operate.schema.templates.IncidentTemplate;
import io.camunda.operate.webapp.api.v1.entities.Incident;
import io.camunda.operate.webapp.api.v1.entities.Query;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.index.query.TermQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ElasticsearchIncidentDaoTest {

  @Mock private IncidentTemplate mockIncidentIndex;

  @Mock private OperateDateTimeFormatter mockDateTimeFormatter;

  @InjectMocks private ElasticsearchIncidentDao underTest;

  @Captor private ArgumentCaptor<QueryBuilder> queryCaptor;

  @Test
  public void testBuildFilteringWithIncidentFilter() {
    final OffsetDateTime creationTime = OffsetDateTime.now();
    final Incident testFilter = new Incident();
    testFilter
        .setKey(123L)
        .setProcessDefinitionKey(222L)
        .setProcessInstanceKey(333L)
        .setType("type")
        .setMessage("message")
        .setState("state")
        .setJobKey(444L)
        .setTenantId("fakeTenant")
        .setCreationTime("2024-02-13T15:10:33.013+0000");

    final SearchSourceBuilder mockBuilder = Mockito.mock(SearchSourceBuilder.class);
    final Query<Incident> mockQuery = Mockito.mock(Query.class);

    when(mockQuery.getFilter()).thenReturn(testFilter);

    final String expectedDateFormat = OperateDateTimeFormatter.DATE_FORMAT_DEFAULT;
    when(mockDateTimeFormatter.getApiDateTimeFormatString()).thenReturn(expectedDateFormat);

    underTest.buildFiltering(mockQuery, mockBuilder);

    // Capture the queryBuilder object
    verify(mockBuilder).query(queryCaptor.capture());
    final QueryBuilder capturedArgument = queryCaptor.getValue();
    assertThat(capturedArgument instanceof BoolQueryBuilder).isTrue();

    // Check that 9 filters are present
    final List<QueryBuilder> mustClauses = ((BoolQueryBuilder) capturedArgument).must();
    assertThat(mustClauses.size()).isEqualTo(9);

    // Check the validity of each filter
    assertThat(((TermQueryBuilder) (mustClauses.get(0))).fieldName()).isEqualTo(Incident.KEY);
    assertThat(((TermQueryBuilder) (mustClauses.get(0))).value()).isEqualTo(testFilter.getKey());
    assertThat(((TermQueryBuilder) (mustClauses.get(1))).fieldName())
        .isEqualTo(Incident.PROCESS_DEFINITION_KEY);
    assertThat(((TermQueryBuilder) (mustClauses.get(1))).value())
        .isEqualTo(testFilter.getProcessDefinitionKey());
    assertThat(((TermQueryBuilder) (mustClauses.get(2))).fieldName())
        .isEqualTo(Incident.PROCESS_INSTANCE_KEY);
    assertThat(((TermQueryBuilder) (mustClauses.get(2))).value())
        .isEqualTo(testFilter.getProcessInstanceKey());
    assertThat(((TermQueryBuilder) (mustClauses.get(3))).fieldName()).isEqualTo(Incident.TYPE);
    assertThat(((TermQueryBuilder) (mustClauses.get(3))).value()).isEqualTo(testFilter.getType());
    assertThat(((MatchQueryBuilder) (mustClauses.get(4))).fieldName()).isEqualTo(Incident.MESSAGE);
    assertThat(((MatchQueryBuilder) (mustClauses.get(4))).value())
        .isEqualTo(testFilter.getMessage());
    assertThat(((TermQueryBuilder) (mustClauses.get(5))).fieldName()).isEqualTo(Incident.STATE);
    assertThat(((TermQueryBuilder) (mustClauses.get(5))).value()).isEqualTo(testFilter.getState());
    assertThat(((TermQueryBuilder) (mustClauses.get(6))).fieldName()).isEqualTo(Incident.JOB_KEY);
    assertThat(((TermQueryBuilder) (mustClauses.get(6))).value()).isEqualTo(testFilter.getJobKey());
    assertThat(((TermQueryBuilder) (mustClauses.get(7))).fieldName()).isEqualTo(Incident.TENANT_ID);
    assertThat(((TermQueryBuilder) (mustClauses.get(7))).value())
        .isEqualTo(testFilter.getTenantId());
    assertThat(((RangeQueryBuilder) (mustClauses.get(8))).fieldName())
        .isEqualTo(Incident.CREATION_TIME);
    assertThat(((RangeQueryBuilder) (mustClauses.get(8))).format()).isEqualTo(expectedDateFormat);
    assertThat(((RangeQueryBuilder) (mustClauses.get(8))).from())
        .isEqualTo("2024-02-13T15:10:33.013+0000");
  }

  @Test
  public void testFilteringWithNoIncidentFilter() {
    final SearchSourceBuilder mockBuilder = Mockito.mock(SearchSourceBuilder.class);
    final Query<Incident> mockQuery = Mockito.mock(Query.class);

    when(mockQuery.getFilter()).thenReturn(null);

    underTest.buildFiltering(mockQuery, mockBuilder);

    // Capture the queryBuilder object
    verify(mockBuilder).query(queryCaptor.capture());
    final QueryBuilder capturedArgument = queryCaptor.getValue();
    assertThat(capturedArgument).isNull();

    verifyNoInteractions(mockDateTimeFormatter);
  }

  @Test
  public void testSearchHitToIncident() {
    final SearchHit mockSearchHit = Mockito.mock(SearchHit.class);

    final Map<String, Object> searchHitAsMap = new HashMap<>();
    searchHitAsMap.put(IncidentTemplate.KEY, 123L);
    searchHitAsMap.put(IncidentTemplate.PROCESS_INSTANCE_KEY, 222L);
    searchHitAsMap.put(IncidentTemplate.PROCESS_DEFINITION_KEY, 333L);
    searchHitAsMap.put(IncidentTemplate.ERROR_TYPE, "errorType");
    searchHitAsMap.put(IncidentTemplate.ERROR_MSG, "message");
    searchHitAsMap.put(IncidentTemplate.CREATION_TIME, "2024-02-13T15:10:33.013+0000");
    searchHitAsMap.put(IncidentTemplate.STATE, "state");
    searchHitAsMap.put(IncidentTemplate.JOB_KEY, 444L);
    searchHitAsMap.put(IncidentTemplate.TENANT_ID, "tenant");

    when(mockSearchHit.getSourceAsMap()).thenReturn(searchHitAsMap);
    final String parsedDateTime = "2024-02-13T15:10:33.013+00:00";
    when(mockDateTimeFormatter.convertGeneralToApiDateTime(anyString())).thenReturn(parsedDateTime);

    final Incident result = underTest.searchHitToIncident(mockSearchHit);

    assertThat(result).isNotNull();
    assertThat(result.getKey()).isEqualTo(searchHitAsMap.get(IncidentTemplate.KEY));
    assertThat(result.getProcessInstanceKey())
        .isEqualTo(searchHitAsMap.get(IncidentTemplate.PROCESS_INSTANCE_KEY));
    assertThat(result.getProcessDefinitionKey())
        .isEqualTo(searchHitAsMap.get(IncidentTemplate.PROCESS_DEFINITION_KEY));
    assertThat(result.getType()).isEqualTo(searchHitAsMap.get(IncidentTemplate.ERROR_TYPE));
    assertThat(result.getMessage()).isEqualTo(searchHitAsMap.get(IncidentTemplate.ERROR_MSG));
    assertThat(result.getCreationTime()).isEqualTo(parsedDateTime);
    assertThat(result.getState()).isEqualTo(searchHitAsMap.get(IncidentTemplate.STATE));
    assertThat(result.getJobKey()).isEqualTo(searchHitAsMap.get(IncidentTemplate.JOB_KEY));
    assertThat(result.getTenantId()).isEqualTo(searchHitAsMap.get(IncidentTemplate.TENANT_ID));

    verify(mockSearchHit, times(1)).getSourceAsMap();
  }
}
