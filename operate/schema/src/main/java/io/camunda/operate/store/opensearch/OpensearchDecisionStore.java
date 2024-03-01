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
package io.camunda.operate.store.opensearch;

import static io.camunda.operate.store.opensearch.dsl.AggregationDSL.cardinalityAggregation;
import static io.camunda.operate.store.opensearch.dsl.QueryDSL.matchAll;
import static io.camunda.operate.store.opensearch.dsl.QueryDSL.withTenantCheck;
import static io.camunda.operate.store.opensearch.dsl.RequestDSL.searchRequestBuilder;
import static io.camunda.operate.util.ExceptionHelper.withIOException;

import io.camunda.operate.conditions.OpensearchCondition;
import io.camunda.operate.schema.indices.DecisionIndex;
import io.camunda.operate.store.BatchRequest;
import io.camunda.operate.store.DecisionStore;
import io.camunda.operate.store.opensearch.client.sync.RichOpenSearchClient;
import java.io.IOException;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Conditional;
import org.springframework.stereotype.Component;

@Conditional(OpensearchCondition.class)
@Component
public class OpensearchDecisionStore implements DecisionStore {

  private static final Logger logger = LoggerFactory.getLogger(OpensearchDecisionStore.class);

  private static final String DISTINCT_FIELD_COUNTS = "distinctFieldCounts";
  @Autowired private DecisionIndex decisionIndex;

  @Autowired private RichOpenSearchClient richOpenSearchClient;

  @Autowired private BeanFactory beanFactory;

  @Override
  public Optional<Long> getDistinctCountFor(String fieldName) {
    var indexAlias = decisionIndex.getAlias();
    var searchRequestBuilder =
        searchRequestBuilder(indexAlias)
            .query(withTenantCheck(matchAll()))
            .size(0)
            .aggregations(
                DISTINCT_FIELD_COUNTS, cardinalityAggregation(fieldName, 1_000)._toAggregation());

    try {
      var searchResponse = richOpenSearchClient.doc().search(searchRequestBuilder, Void.class);

      return Optional.of(
          searchResponse.aggregations().get(DISTINCT_FIELD_COUNTS).cardinality().value());
    } catch (Exception e) {
      logger.error(
          String.format(
              "Error in distinct count for field %s in index alias %s.", fieldName, indexAlias),
          e);
      return Optional.empty();
    }
  }

  @Override
  public BatchRequest newBatchRequest() {
    return beanFactory.getBean(BatchRequest.class);
  }

  @Override
  public long deleteDocuments(String indexName, String idField, String id) throws IOException {
    return withIOException(
        () -> richOpenSearchClient.doc().delete(indexName, idField, id).deleted());
  }
}
