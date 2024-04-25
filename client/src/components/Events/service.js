/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a proprietary license.
 * See the License.txt file for more information. You may not use this file
 * except in compliance with the proprietary license.
 */

import {get, post, put} from 'request';

export {getUsers, updateUsers, publish, createProcess, loadExternalGroups} from './service.ts';

export async function loadProcesses() {
  const response = await get('api/eventBasedProcess');
  return await response.json();
}

export async function loadProcess(id) {
  const response = await get('api/eventBasedProcess/' + id);
  return await response.json();
}

export async function cancelPublish(id) {
  return await post(`api/eventBasedProcess/${id}/_cancelPublish`);
}

export async function updateProcess(id, name, xml, mappings, eventSources) {
  return await put('api/eventBasedProcess/' + id, {name, xml, mappings, eventSources});
}

export async function loadEvents(body, searchTerm, sorting) {
  const query = {};
  if (searchTerm) {
    query.searchTerm = searchTerm;
  }

  if (sorting) {
    query.sortBy = sorting.by;
    query.sortOrder = sorting.order;
  }

  const response = await post('api/event/count', body, {query});
  return await response.json();
}

export async function getCleanedMappings(body) {
  const response = await post('api/eventBasedProcess/_mappingCleanup', body);
  return await response.json();
}

export function isNonTimerEvent(node) {
  if (!node?.$instanceOf('bpmn:Event')) {
    return false;
  }

  if (node.eventDefinitions?.[0]) {
    return !node.eventDefinitions[0].$instanceOf('bpmn:TimerEventDefinition');
  }

  return true;
}

export async function loadIngestedEvents(params) {
  const response = await get('api/event', params);

  return await response.json();
}

export async function deleteEvents(eventsIds) {
  return await post('api/event/delete', eventsIds);
}

export async function deleteProcesses(processes) {
  return await post(
    'api/eventBasedProcess/delete',
    processes.map(({id}) => id)
  );
}

export async function checkDeleteConflicts(processes) {
  const response = await post(
    'api/eventBasedProcess/delete-conflicts',
    processes.map(({id}) => id)
  );

  return response.json();
}
