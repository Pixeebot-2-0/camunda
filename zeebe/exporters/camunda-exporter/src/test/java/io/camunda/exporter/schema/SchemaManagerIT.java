/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH under
 * one or more contributor license agreements. See the NOTICE file distributed
 * with this work for additional information regarding copyright ownership.
 * Licensed under the Camunda License 1.0. You may not use this file
 * except in compliance with the Camunda License 1.0.
 */
package io.camunda.exporter.schema;

import static io.camunda.exporter.schema.SchemaTestUtil.mappingsMatch;
import static io.camunda.exporter.utils.CamundaExporterITInvocationProvider.CONFIG_PREFIX;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import io.camunda.exporter.config.ConnectionTypes;
import io.camunda.exporter.config.ExporterConfiguration;
import io.camunda.exporter.schema.elasticsearch.ElasticsearchEngineClient;
import io.camunda.exporter.schema.opensearch.OpensearchEngineClient;
import io.camunda.exporter.utils.CamundaExporterITInvocationProvider;
import io.camunda.exporter.utils.SearchClientAdapter;
import io.camunda.search.connect.es.ElasticsearchConnector;
import io.camunda.search.connect.os.OpensearchConnector;
import io.camunda.webapps.schema.descriptors.IndexDescriptor;
import io.camunda.webapps.schema.descriptors.IndexTemplateDescriptor;
import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
import org.opensearch.client.opensearch._types.OpenSearchException;

@ExtendWith(CamundaExporterITInvocationProvider.class)
public class SchemaManagerIT {

  private IndexDescriptor index;
  private IndexTemplateDescriptor indexTemplate;

  @BeforeEach
  public void refresh() throws IOException {
    indexTemplate =
        SchemaTestUtil.mockIndexTemplate(
            "index_name",
            "test*",
            "template_alias",
            Collections.emptyList(),
            CONFIG_PREFIX + "-template_name",
            "/mappings.json");

    index =
        SchemaTestUtil.mockIndex(
            CONFIG_PREFIX + "-qualified_name", "alias", "index_name", "/mappings.json");

    when(indexTemplate.getFullQualifiedName())
        .thenReturn(CONFIG_PREFIX + "-template-index-qualified-name");
  }

  private SearchEngineClient searchEngineClientFromConfig(final ExporterConfiguration config) {
    if (config.getConnect().getType().equals(ConnectionTypes.ELASTICSEARCH.getType())) {
      final var client = new ElasticsearchConnector(config.getConnect()).createClient();
      return new ElasticsearchEngineClient(client);
    } else if (config.getConnect().getType().equals(ConnectionTypes.OPENSEARCH.getType())) {
      final var client = new OpensearchConnector(config.getConnect()).createClient();
      return new OpensearchEngineClient(client);
    }
    throw new IllegalArgumentException("Unknown connection type: " + config.getConnect().getType());
  }

  @TestTemplate
  void shouldAppendToIndexMappingsWithNewProperties(
      final ExporterConfiguration config, final SearchClientAdapter searchClientAdapter)
      throws Exception {
    // given
    final var schemaManager =
        new SchemaManager(
            searchEngineClientFromConfig(config),
            Set.of(index),
            Set.of(),
            new ExporterConfiguration());

    schemaManager.initialiseResources();

    // when
    final var newProperties = new HashSet<IndexMappingProperty>();
    newProperties.add(new IndexMappingProperty("foo", Map.of("type", "text")));
    newProperties.add(new IndexMappingProperty("bar", Map.of("type", "keyword")));

    final Map<IndexDescriptor, Collection<IndexMappingProperty>> schemasToChange =
        Map.of(index, newProperties);

    schemaManager.updateSchema(schemasToChange);

    // then
    final var updatedIndex = searchClientAdapter.getIndexAsNode(index.getFullQualifiedName());

    assertThat(updatedIndex.at("/mappings/properties/foo/type").asText()).isEqualTo("text");
    assertThat(updatedIndex.at("/mappings/properties/bar/type").asText()).isEqualTo("keyword");
  }

  @TestTemplate
  void shouldInheritDefaultSettingsIfNoIndexSpecificSettings(
      final ExporterConfiguration config, final SearchClientAdapter searchClientAdapter)
      throws Exception {
    // given
    final var properties = new ExporterConfiguration();
    properties.getIndex().setNumberOfReplicas(10);
    properties.getIndex().setNumberOfShards(10);

    final var schemaManager =
        new SchemaManager(
            searchEngineClientFromConfig(config), Set.of(index), Set.of(indexTemplate), properties);

    // when
    schemaManager.initialiseResources();

    // then
    final var retrievedIndex = searchClientAdapter.getIndexAsNode(index.getFullQualifiedName());

    assertThat(retrievedIndex.at("/settings/index/number_of_replicas").asInt()).isEqualTo(10);
    assertThat(retrievedIndex.at("/settings/index/number_of_shards").asInt()).isEqualTo(10);
  }

  @TestTemplate
  void shouldUseIndexSpecificSettingsIfSpecified(
      final ExporterConfiguration config, final SearchClientAdapter searchClientAdapter)
      throws Exception {
    // given
    final var properties = new ExporterConfiguration();
    properties.getIndex().setNumberOfReplicas(10);
    properties.getIndex().setNumberOfShards(10);
    properties.getIndex().setReplicasByIndexName(Map.of("index_name", 5));
    properties.getIndex().setShardsByIndexName(Map.of("index_name", 5));

    final var schemaManager =
        new SchemaManager(
            searchEngineClientFromConfig(config), Set.of(index), Set.of(indexTemplate), properties);

    // when
    schemaManager.initialiseResources();

    // then
    final var retrievedIndex = searchClientAdapter.getIndexAsNode(index.getFullQualifiedName());

    assertThat(retrievedIndex.at("/settings/index/number_of_replicas").asInt()).isEqualTo(5);
    assertThat(retrievedIndex.at("/settings/index/number_of_shards").asInt()).isEqualTo(5);
  }

  @TestTemplate
  void shouldOverwriteIndexTemplateIfMappingsFileChanged(
      final ExporterConfiguration config, final SearchClientAdapter searchClientAdapter)
      throws Exception {
    // given
    final var schemaManager =
        new SchemaManager(
            searchEngineClientFromConfig(config),
            Set.of(),
            Set.of(indexTemplate),
            new ExporterConfiguration());

    schemaManager.initialiseResources();

    // when
    when(indexTemplate.getMappingsClasspathFilename()).thenReturn("/mappings-added-property.json");

    final Map<IndexDescriptor, Collection<IndexMappingProperty>> schemasToChange =
        Map.of(indexTemplate, Set.of());
    schemaManager.updateSchema(schemasToChange);

    // then
    final var template =
        searchClientAdapter.getIndexTemplateAsNode(indexTemplate.getTemplateName());

    assertThat(
            mappingsMatch(
                template.at("/index_template/template/mappings"), "/mappings-added-property.json"))
        .isTrue();
  }

  @TestTemplate
  void shouldCreateAllSchemasIfCreateEnabled(
      final ExporterConfiguration config, final SearchClientAdapter searchClientAdapter)
      throws Exception {
    // given
    final var schemaManager =
        new SchemaManager(
            searchEngineClientFromConfig(config), Set.of(index), Set.of(indexTemplate), config);

    // when
    schemaManager.startup();

    // then
    final var retrievedIndex = searchClientAdapter.getIndexAsNode(index.getFullQualifiedName());
    final var retrievedIndexTemplate =
        searchClientAdapter.getIndexTemplateAsNode(indexTemplate.getTemplateName());

    assertThat(mappingsMatch(retrievedIndex.get("mappings"), "/mappings.json")).isTrue();
    assertThat(
            mappingsMatch(
                retrievedIndexTemplate.at("/index_template/template/mappings"), "/mappings.json"))
        .isTrue();
  }

  @TestTemplate
  void shouldUpdateSchemasCorrectlyIfCreateEnabled(
      final ExporterConfiguration config, final SearchClientAdapter searchClientAdapter)
      throws Exception {
    // given
    config.setCreateSchema(true);
    final var schemaManager =
        new SchemaManager(
            searchEngineClientFromConfig(config), Set.of(index), Set.of(indexTemplate), config);

    schemaManager.startup();

    // when
    when(index.getMappingsClasspathFilename()).thenReturn("/mappings-added-property.json");
    when(indexTemplate.getMappingsClasspathFilename()).thenReturn("/mappings-added-property.json");

    schemaManager.startup();

    // then
    final var retrievedIndex = searchClientAdapter.getIndexAsNode(index.getFullQualifiedName());
    final var retrievedIndexTemplate =
        searchClientAdapter.getIndexTemplateAsNode(indexTemplate.getTemplateName());

    assertThat(mappingsMatch(retrievedIndex.get("mappings"), "/mappings-added-property.json"))
        .isTrue();
    assertThat(
            mappingsMatch(
                retrievedIndexTemplate.at("/index_template/template/mappings"),
                "/mappings-added-property.json"))
        .isTrue();
  }

  @TestTemplate
  void shouldCreateNewSchemasIfNewIndexDescriptorAddedToExistingSchemas(
      final ExporterConfiguration config, final SearchClientAdapter searchClientAdapter)
      throws Exception {
    // given
    config.setCreateSchema(true);
    final var indices = new HashSet<IndexDescriptor>();
    final var indexTemplates = new HashSet<IndexTemplateDescriptor>();

    indices.add(index);
    indexTemplates.add(indexTemplate);

    final var schemaManager =
        new SchemaManager(searchEngineClientFromConfig(config), indices, indexTemplates, config);

    schemaManager.startup();

    // when
    final var newIndex =
        SchemaTestUtil.mockIndex(
            "new_index_qualified", "new_alias", "new_index", "/mappings-added-property.json");
    final var newIndexTemplate =
        SchemaTestUtil.mockIndexTemplate(
            "new_template_name",
            "new_test*",
            "new_template_alias",
            Collections.emptyList(),
            "new_template_name",
            "/mappings-added-property.json");

    when(newIndexTemplate.getFullQualifiedName())
        .thenReturn(config.getIndex().getPrefix() + "new_template_index_qualified_name");

    indices.add(newIndex);
    indexTemplates.add(newIndexTemplate);

    schemaManager.startup();

    // then
    final var retrievedNewIndex =
        searchClientAdapter.getIndexAsNode(newIndex.getFullQualifiedName());
    final var retrievedNewTemplate =
        searchClientAdapter.getIndexTemplateAsNode(newIndexTemplate.getTemplateName());

    assertThat(mappingsMatch(retrievedNewIndex.get("mappings"), "/mappings-added-property.json"))
        .isTrue();
    assertThat(
            mappingsMatch(
                retrievedNewTemplate.at("/index_template/template/mappings"),
                "/mappings-added-property.json"))
        .isTrue();
  }

  @TestTemplate
  void shouldNotPutAnySchemasIfCreatedDisabled(
      final ExporterConfiguration config, final SearchClientAdapter searchClientAdapter) {
    // given
    config.setCreateSchema(false);

    final var schemaManager =
        new SchemaManager(
            searchEngineClientFromConfig(config), Set.of(index), Set.of(indexTemplate), config);

    schemaManager.startup();

    // then
    assertThatThrownBy(() -> searchClientAdapter.getIndexAsNode(index.getFullQualifiedName()))
        .isInstanceOfAny(ElasticsearchException.class, OpenSearchException.class)
        .hasMessageContaining("no such index");
    assertThatThrownBy(
            () -> searchClientAdapter.getIndexTemplateAsNode(indexTemplate.getTemplateName()))
        .isInstanceOfAny(ElasticsearchException.class, OpenSearchException.class)
        .hasMessageContaining(String.format("[%s] not found", indexTemplate.getTemplateName()));
  }

  @TestTemplate
  void shouldCreateLifeCyclePoliciesOnStartupIfEnabled(
      final ExporterConfiguration config, final SearchClientAdapter searchClientAdapter)
      throws IOException {
    config.setCreateSchema(true);
    config.getRetention().setEnabled(true);
    config.getRetention().setPolicyName("policy_name");

    final var schemaManager =
        new SchemaManager(searchEngineClientFromConfig(config), Set.of(), Set.of(), config);

    schemaManager.startup();

    final var policy = searchClientAdapter.getPolicyAsNode("policy_name");

    assertThat(policy.get("policy")).isNotNull();
  }

  @TestTemplate
  void shouldCreateIndexInAdditionToTemplateFromTemplateDescriptor(
      final ExporterConfiguration config, final SearchClientAdapter searchClientAdapter)
      throws Exception {
    config.setCreateSchema(true);

    final var schemaManager =
        new SchemaManager(
            searchEngineClientFromConfig(config), Set.of(), Set.of(indexTemplate), config);

    schemaManager.startup();

    final var retrievedIndex =
        searchClientAdapter.getIndexAsNode(indexTemplate.getFullQualifiedName());

    assertThat(retrievedIndex.at("/settings/index/provided_name").asText())
        .isEqualTo(indexTemplate.getFullQualifiedName());
  }
}
