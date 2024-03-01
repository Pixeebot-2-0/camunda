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
package io.camunda.operate.webapp.reader;

import io.camunda.operate.entities.ProcessEntity;
import io.camunda.operate.store.ProcessStore;
import io.camunda.operate.webapp.rest.dto.ProcessRequestDto;
import io.camunda.operate.webapp.security.identity.IdentityPermission;
import io.camunda.operate.webapp.security.identity.PermissionsService;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProcessReader {

  private static final Logger logger =
      LoggerFactory.getLogger(io.camunda.operate.webapp.reader.ProcessReader.class);

  @Autowired private ProcessStore processStore;

  @Autowired(required = false)
  private PermissionsService permissionsService;

  /**
   * Gets the process diagram XML as a string.
   *
   * @param processDefinitionKey
   * @return
   */
  public String getDiagram(Long processDefinitionKey) {
    return processStore.getDiagramByKey(processDefinitionKey);
  }

  /**
   * Gets the process by id.
   *
   * @param processDefinitionKey
   * @return
   */
  public ProcessEntity getProcess(Long processDefinitionKey) {
    return processStore.getProcessByKey(processDefinitionKey);
  }

  /**
   * Returns map of Process entities grouped by bpmnProcessId.
   *
   * @return
   */
  public Map<ProcessStore.ProcessKey, List<ProcessEntity>> getProcessesGrouped(
      ProcessRequestDto request) {
    return processStore.getProcessesGrouped(
        request.getTenantId(), getAllowedProcessIdsOrNullForAll());
  }

  /**
   * Returns up to maxSize ProcessEntities only filled with the given field names.
   *
   * @return Map of id -> ProcessEntity
   */
  public Map<Long, ProcessEntity> getProcessesWithFields(int maxSize, String... fields) {
    return processStore.getProcessesIdsToProcessesWithFields(
        getAllowedProcessIdsOrNullForAll(), maxSize, fields);
  }

  /**
   * Returns up to 1000 ProcessEntities only filled with the given field names.
   *
   * @return Map of id -> ProcessEntity
   */
  public Map<Long, ProcessEntity> getProcessesWithFields(String... fields) {
    return getProcessesWithFields(1000, fields);
  }

  private Set<String> getAllowedProcessIdsOrNullForAll() {
    if (permissionsService == null) return null;

    final PermissionsService.ResourcesAllowed allowed =
        permissionsService.getProcessesWithPermission(IdentityPermission.READ);
    return allowed == null || allowed.isAll() ? null : allowed.getIds();
  }
}
