/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a proprietary license.
 * See the License.txt file for more information. You may not use this file
 * except in compliance with the proprietary license.
 */

import {ProcessInstancesDto} from 'modules/api/processInstances/fetchProcessInstances';
import {ProcessDto} from 'modules/api/processes/fetchGroupedProcesses';

const mockGroupedProcesses = [
  {
    bpmnProcessId: 'always-completing-process',
    name: 'Always completing process',
    permissions: [],
    processes: [
      {
        id: '2251799813685249',
        name: 'Always completing process',
        version: 1,
        bpmnProcessId: 'always-completing-process',
      },
    ],
  },
  {
    bpmnProcessId: 'bigVarProcess',
    name: 'Big variable process',
    permissions: [],
    processes: [
      {
        id: '2251799813685430',
        name: 'Big variable process',
        version: 1,
        bpmnProcessId: 'bigVarProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'call-activity-process',
    name: 'Call Activity Process',
    permissions: [],
    processes: [
      {
        id: '2251799813686145',
        name: 'Call Activity Process',
        version: 1,
        bpmnProcessId: 'call-activity-process',
      },
    ],
  },
  {
    bpmnProcessId: 'invoice',
    name: 'DMN invoice',
    permissions: [],
    processes: [
      {
        id: '2251799813686130',
        name: 'DMN invoice',
        version: 1,
        bpmnProcessId: 'invoice',
      },
    ],
  },
  {
    bpmnProcessId: 'dataStoreProcess',
    name: 'Data store process',
    permissions: [],
    processes: [
      {
        id: '2251799813686159',
        name: 'Data store process',
        version: 1,
        bpmnProcessId: 'dataStoreProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'errorProcess',
    name: 'Error Process',
    permissions: [],
    processes: [
      {
        id: '2251799813686151',
        name: 'Error Process',
        version: 1,
        bpmnProcessId: 'errorProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'escalationEvents',
    name: 'Escalation events',
    permissions: [],
    processes: [
      {
        id: '2251799813687212',
        name: 'Escalation events',
        version: 2,
        bpmnProcessId: 'escalationEvents',
      },
      {
        id: '2251799813686163',
        name: 'Escalation events',
        version: 1,
        bpmnProcessId: 'escalationEvents',
      },
    ],
  },
  {
    bpmnProcessId: 'eventSubprocessProcess',
    name: 'Event Subprocess Process',
    permissions: [],
    processes: [
      {
        id: '2251799813686147',
        name: 'Event Subprocess Process',
        version: 1,
        bpmnProcessId: 'eventSubprocessProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'eventBasedGatewayProcess',
    name: 'Event based gateway with timer start',
    permissions: [],
    processes: [
      {
        id: '2251799813687203',
        name: 'Event based gateway with timer start',
        version: 2,
        bpmnProcessId: 'eventBasedGatewayProcess',
      },
      {
        id: '2251799813686134',
        name: 'Event based gateway with message start',
        version: 1,
        bpmnProcessId: 'eventBasedGatewayProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'flightRegistration',
    name: 'Flight registration',
    permissions: [],
    processes: [
      {
        id: '2251799813687190',
        name: 'Flight registration',
        version: 2,
        bpmnProcessId: 'flightRegistration',
      },
      {
        id: '2251799813686118',
        name: 'Flight registration',
        version: 1,
        bpmnProcessId: 'flightRegistration',
      },
    ],
  },
  {
    bpmnProcessId: 'inclusiveGatewayProcess',
    name: 'Inclusive gateway',
    permissions: [],
    processes: [
      {
        id: '2251799813686168',
        name: 'Inclusive gateway',
        version: 1,
        bpmnProcessId: 'inclusiveGatewayProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'Process_b1711b2e-ec8e-4dad-908c-8c12e028f32f',
    name: 'Input Output Mapping Test',
    permissions: [],
    processes: [
      {
        id: '2251799813685251',
        name: 'Input Output Mapping Test',
        version: 1,
        bpmnProcessId: 'Process_b1711b2e-ec8e-4dad-908c-8c12e028f32f',
      },
    ],
  },
  {
    bpmnProcessId: 'linkEventProcess',
    name: 'Link events process',
    permissions: [],
    processes: [
      {
        id: '2251799813686161',
        name: 'Link events process',
        version: 1,
        bpmnProcessId: 'linkEventProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'multiInstanceProcess',
    name: 'Multi-Instance Process',
    permissions: [],
    processes: [
      {
        id: '2251799813687192',
        name: 'Multi-Instance Process',
        version: 2,
        bpmnProcessId: 'multiInstanceProcess',
      },
      {
        id: '2251799813686120',
        name: 'Sequential Multi-Instance Process',
        version: 1,
        bpmnProcessId: 'multiInstanceProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'prWithSubprocess',
    name: 'Nested subprocesses',
    permissions: [],
    processes: [
      {
        id: '2251799813686137',
        name: 'Nested subprocesses',
        version: 1,
        bpmnProcessId: 'prWithSubprocess',
      },
    ],
  },
  {
    bpmnProcessId: 'onlyIncidentsProcess',
    name: 'Only Incidents Process',
    permissions: [],
    processes: [
      {
        id: '2251799813685301',
        name: 'Only Incidents Process',
        version: 2,
        bpmnProcessId: 'onlyIncidentsProcess',
      },
      {
        id: '2251799813685257',
        name: 'Only Incidents Process',
        version: 1,
        bpmnProcessId: 'onlyIncidentsProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'orderProcess',
    name: 'Order process',
    permissions: [],
    processes: [
      {
        id: '2251799813687188',
        name: 'Order process',
        version: 2,
        bpmnProcessId: 'orderProcess',
      },
      {
        id: '2251799813686114',
        name: 'Order process',
        version: 1,
        bpmnProcessId: 'orderProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'signalEventProcess',
    name: 'Signal event',
    permissions: [],
    processes: [
      {
        id: '2251799813686165',
        name: 'Signal event',
        version: 1,
        bpmnProcessId: 'signalEventProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'terminateEndEvent',
    name: 'Terminate End Event',
    permissions: [],
    processes: [
      {
        id: '2251799813686155',
        name: 'Terminate End Event',
        version: 1,
        bpmnProcessId: 'terminateEndEvent',
      },
    ],
  },
  {
    bpmnProcessId: 'timerProcess',
    name: 'Timer process',
    permissions: [],
    processes: [
      {
        id: '2251799813687198',
        name: 'Timer process',
        version: 2,
        bpmnProcessId: 'timerProcess',
      },
      {
        id: '2251799813686143',
        name: 'Timer process',
        version: 1,
        bpmnProcessId: 'timerProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'withoutIncidentsProcess',
    name: 'Without Incidents Process',
    permissions: [],
    processes: [
      {
        id: '2251799813685364',
        name: 'Without Incidents Process',
        version: 2,
        bpmnProcessId: 'withoutIncidentsProcess',
      },
      {
        id: '2251799813685350',
        name: 'Without Incidents Process',
        version: 1,
        bpmnProcessId: 'withoutIncidentsProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'noInstancesProcess',
    name: 'Without Instances Process',
    permissions: [],
    processes: [
      {
        id: '2251799813685255',
        name: 'Without Instances Process',
        version: 2,
        bpmnProcessId: 'noInstancesProcess',
      },
      {
        id: '2251799813685253',
        name: 'Without Instances Process',
        version: 1,
        bpmnProcessId: 'noInstancesProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'undefined-task-process',
    name: 'undefined-task',
    permissions: [],
    processes: [
      {
        id: '2251799813686157',
        name: 'undefined-task',
        version: 1,
        bpmnProcessId: 'undefined-task-process',
      },
    ],
  },
  {
    bpmnProcessId: 'bigProcess',
    name: null,
    permissions: [],
    processes: [
      {
        id: '2251799813686149',
        name: null,
        version: 1,
        bpmnProcessId: 'bigProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'called-process',
    name: null,
    permissions: [],
    processes: [
      {
        id: '2251799813687891',
        name: null,
        version: 2,
        bpmnProcessId: 'called-process',
      },
      {
        id: '2251799813687210',
        name: 'Called Process',
        version: 1,
        bpmnProcessId: 'called-process',
      },
    ],
  },
  {
    bpmnProcessId: 'complexProcess',
    name: null,
    permissions: [],
    processes: [
      {
        id: '2251799813687889',
        name: null,
        version: 3,
        bpmnProcessId: 'complexProcess',
      },
      {
        id: '2251799813687201',
        name: null,
        version: 2,
        bpmnProcessId: 'complexProcess',
      },
      {
        id: '2251799813686132',
        name: null,
        version: 1,
        bpmnProcessId: 'complexProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'error-end-process',
    name: null,
    permissions: [],
    processes: [
      {
        id: '2251799813686153',
        name: null,
        version: 1,
        bpmnProcessId: 'error-end-process',
      },
    ],
  },
  {
    bpmnProcessId: 'intermediate-message-throw-event-process',
    name: null,
    permissions: [],
    processes: [
      {
        id: '2251799813686124',
        name: null,
        version: 1,
        bpmnProcessId: 'intermediate-message-throw-event-process',
      },
    ],
  },
  {
    bpmnProcessId: 'intermediate-none-event-process',
    name: null,
    permissions: [],
    processes: [
      {
        id: '2251799813686126',
        name: null,
        version: 1,
        bpmnProcessId: 'intermediate-none-event-process',
      },
    ],
  },
  {
    bpmnProcessId: 'interruptingBoundaryEvent',
    name: null,
    permissions: [],
    processes: [
      {
        id: '2251799813687206',
        name: null,
        version: 2,
        bpmnProcessId: 'interruptingBoundaryEvent',
      },
      {
        id: '2251799813686139',
        name: null,
        version: 1,
        bpmnProcessId: 'interruptingBoundaryEvent',
      },
    ],
  },
  {
    bpmnProcessId: 'loanProcess',
    name: null,
    permissions: [],
    processes: [
      {
        id: '2251799813686116',
        name: null,
        version: 1,
        bpmnProcessId: 'loanProcess',
      },
    ],
  },
  {
    bpmnProcessId: 'manual-task-process',
    name: null,
    permissions: [],
    processes: [
      {
        id: '2251799813686122',
        name: null,
        version: 1,
        bpmnProcessId: 'manual-task-process',
      },
    ],
  },
  {
    bpmnProcessId: 'message-end-event-process',
    name: null,
    permissions: [],
    processes: [
      {
        id: '2251799813686128',
        name: null,
        version: 1,
        bpmnProcessId: 'message-end-event-process',
      },
    ],
  },
  {
    bpmnProcessId: 'nonInterruptingBoundaryEvent',
    name: null,
    permissions: [],
    processes: [
      {
        id: '2251799813687208',
        name: null,
        version: 2,
        bpmnProcessId: 'nonInterruptingBoundaryEvent',
      },
      {
        id: '2251799813686141',
        name: null,
        version: 1,
        bpmnProcessId: 'nonInterruptingBoundaryEvent',
      },
    ],
  },
] as ProcessDto[];

const mockBatchOperations: OperationEntity[] = [
  {
    id: '653ed5e6-49ed-4675-85bf-2c54a94d8180',
    name: null,
    type: 'RESOLVE_INCIDENT',
    startDate: '2023-08-25T15:41:45.322+0300',
    endDate: '2023-08-25T15:41:49.754+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: 'bf547ac3-9a35-45b9-ab06-b80b43785154',
    name: null,
    type: 'ADD_VARIABLE',
    startDate: '2023-08-24T11:24:21.942+0300',
    endDate: '2023-08-24T11:24:27.467+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: '5dd91cae-5f0c-4e35-a698-5a7887c4fbbd',
    name: null,
    type: 'RESOLVE_INCIDENT',
    startDate: '2023-08-18T13:19:23.269+0300',
    endDate: '2023-08-18T13:19:23.314+0300',
    instancesCount: 1,
    operationsTotalCount: 0,
    operationsFinishedCount: 0,
  },
  {
    id: 'b1454600-5f13-4365-bb45-960e8372136b',
    name: null,
    type: 'RESOLVE_INCIDENT',
    startDate: '2023-08-18T13:14:32.297+0300',
    endDate: '2023-08-18T13:14:37.023+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: '513aa565-b7f2-440a-9523-1b2f647ddfdd',
    name: null,
    type: 'DELETE_PROCESS_INSTANCE',
    startDate: '2023-08-18T11:42:04.972+0300',
    endDate: '2023-08-18T11:42:09.553+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: 'c4e125da-2b5c-42f5-badc-9a78ebd8f006',
    name: null,
    type: 'RESOLVE_INCIDENT',
    startDate: '2023-08-15T13:47:26.687+0300',
    endDate: '2023-08-15T13:47:33.948+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: '0bd1a7a8-91cc-4a82-aaa5-1a32132f6fa7',
    name: null,
    type: 'ADD_VARIABLE',
    startDate: '2023-08-15T13:30:08.857+0300',
    endDate: '2023-08-15T13:30:11.071+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: '8a8150d6-d9a8-437d-9f8a-ec277fb232f1',
    name: null,
    type: 'ADD_VARIABLE',
    startDate: '2023-08-15T13:27:42.190+0300',
    endDate: '2023-08-15T13:27:45.944+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: '01360ff5-0f46-4952-93bf-be5ca040bb7a',
    name: null,
    type: 'ADD_VARIABLE',
    startDate: '2023-08-15T13:22:55.699+0300',
    endDate: '2023-08-15T13:23:00.700+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: 'c5e97ca8-bdf9-434f-934f-506a6960d1e3',
    name: null,
    type: 'RESOLVE_INCIDENT',
    startDate: '2023-08-15T13:17:32.235+0300',
    endDate: '2023-08-15T13:17:36.637+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: '35ccdcfc-aeac-4ec8-ac6c-db67e581b22e',
    name: null,
    type: 'MODIFY_PROCESS_INSTANCE',
    startDate: '2023-08-15T10:42:17.548+0300',
    endDate: '2023-08-15T10:42:18.818+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: '0f004110-547d-4aa3-b9c4-39d277d41f97',
    name: null,
    type: 'RESOLVE_INCIDENT',
    startDate: '2023-08-14T10:46:29.261+0300',
    endDate: '2023-08-14T10:46:34.983+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: 'fb7cfeb0-abaa-4323-8910-9d44fe031c08',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2023-08-14T08:46:05.677+0300',
    endDate: '2023-08-14T08:46:25.020+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: 'c1331a55-3f6f-4884-837f-dfa268f7ef0c',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2023-08-14T08:46:05.459+0300',
    endDate: '2023-08-14T08:46:25.010+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: 'af9be740-adb8-4c2b-b5b6-d14731c4a74f',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2023-08-14T08:46:06.369+0300',
    endDate: '2023-08-14T08:46:24.990+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: 'f9ddd801-ff34-44da-8d7c-366036b6d8d8',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2023-08-14T08:46:06.344+0300',
    endDate: '2023-08-14T08:46:14.987+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: 'dc824c36-d075-49c6-8a7e-b45eebba815f',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2023-08-14T08:46:06.439+0300',
    endDate: '2023-08-14T08:46:14.981+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: 'cfdf3baa-e6a6-48bc-8763-487d09be2467',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2023-08-14T08:46:05.738+0300',
    endDate: '2023-08-14T08:46:14.974+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: 'a74db3d1-4588-41a5-9e10-42cea80213a6',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2023-08-14T08:46:06.164+0300',
    endDate: '2023-08-14T08:46:14.965+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
  {
    id: '9961d35a-261f-4b29-b506-8b14cc6e7992',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2023-08-14T08:46:05.569+0300',
    endDate: '2023-08-14T08:46:14.942+0300',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
  },
];

const mockProcessInstances: ProcessInstancesDto = {
  processInstances: [
    {
      id: '2251799813934753',
      processId: '2251799813687198',
      processName: 'Timer process',
      processVersion: 2,
      startDate: '2023-08-28T12:52:47.586+0000',
      endDate: null,
      state: 'ACTIVE',
      bpmnProcessId: 'timerProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813905557',
      processId: '2251799813687203',
      processName: 'Event based gateway with timer start',
      processVersion: 2,
      startDate: '2023-08-14T05:48:37.633+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'eventBasedGatewayProcess',
      hasActiveOperation: false,
      operations: [
        {
          id: '08ccda65-a82a-49ed-893b-c33fdb20d9cf',
          batchOperationId: '0bd1a7a8-91cc-4a82-aaa5-1a32132f6fa7',
          type: 'ADD_VARIABLE',
          state: 'COMPLETED',
          errorMessage: null,
        },
        {
          id: '25350af0-92a5-44d9-85fa-f694d88a6dba',
          batchOperationId: '8a8150d6-d9a8-437d-9f8a-ec277fb232f1',
          type: 'ADD_VARIABLE',
          state: 'COMPLETED',
          errorMessage: null,
        },
        {
          id: '2e25ce5b-673f-42fa-bb29-a91569206e4f',
          batchOperationId: 'b1454600-5f13-4365-bb45-960e8372136b',
          type: 'RESOLVE_INCIDENT',
          state: 'COMPLETED',
          errorMessage: null,
        },
        {
          id: '31820589-a50f-42de-bd1e-544e472f65ff',
          batchOperationId: '0f004110-547d-4aa3-b9c4-39d277d41f97',
          type: 'RESOLVE_INCIDENT',
          state: 'COMPLETED',
          errorMessage: null,
        },
        {
          id: '5635a619-cbd7-4267-a590-0f59069bb8ca',
          batchOperationId: '01360ff5-0f46-4952-93bf-be5ca040bb7a',
          type: 'ADD_VARIABLE',
          state: 'COMPLETED',
          errorMessage: null,
        },
        {
          id: '5dc3f7d2-92c3-40a3-8243-0eda83003ccd',
          batchOperationId: '653ed5e6-49ed-4675-85bf-2c54a94d8180',
          type: 'RESOLVE_INCIDENT',
          state: 'COMPLETED',
          errorMessage: null,
        },
        {
          id: '77fe7726-00a3-4c83-9c7f-244df2ad8b37',
          batchOperationId: 'c5e97ca8-bdf9-434f-934f-506a6960d1e3',
          type: 'RESOLVE_INCIDENT',
          state: 'COMPLETED',
          errorMessage: null,
        },
      ],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813905508',
      processId: '2251799813687203',
      processName: 'Event based gateway with timer start',
      processVersion: 2,
      startDate: '2023-08-14T05:48:27.644+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'eventBasedGatewayProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813902229',
      processId: '2251799813687203',
      processName: 'Event based gateway with timer start',
      processVersion: 2,
      startDate: '2023-08-14T05:48:17.718+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'eventBasedGatewayProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813896694',
      processId: '2251799813687203',
      processName: 'Event based gateway with timer start',
      processVersion: 2,
      startDate: '2023-08-14T05:48:07.653+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'eventBasedGatewayProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813893246',
      processId: '2251799813687203',
      processName: 'Event based gateway with timer start',
      processVersion: 2,
      startDate: '2023-08-14T05:47:57.664+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'eventBasedGatewayProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813889623',
      processId: '2251799813687203',
      processName: 'Event based gateway with timer start',
      processVersion: 2,
      startDate: '2023-08-14T05:47:47.660+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'eventBasedGatewayProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813885633',
      processId: '2251799813687203',
      processName: 'Event based gateway with timer start',
      processVersion: 2,
      startDate: '2023-08-14T05:47:37.629+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'eventBasedGatewayProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813880821',
      processId: '2251799813687203',
      processName: 'Event based gateway with timer start',
      processVersion: 2,
      startDate: '2023-08-14T05:47:27.628+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'eventBasedGatewayProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813855554',
      processId: '2251799813687203',
      processName: 'Event based gateway with timer start',
      processVersion: 2,
      startDate: '2023-08-14T05:47:17.605+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'eventBasedGatewayProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831475',
      processId: '2251799813687203',
      processName: 'Event based gateway with timer start',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.622+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'eventBasedGatewayProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062811',
      processId: '2251799813686145',
      processName: 'Call Activity Process',
      processVersion: 1,
      startDate: '2023-08-14T05:47:07.376+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'call-activity-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062817',
      processId: '2251799813687891',
      processName: 'called-process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.376+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'called-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '6755399441062811',
      rootInstanceId: '6755399441062811',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062827',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.376+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [
        {
          id: '87ced7c0-cc22-40c5-bbe3-eafafc111520',
          batchOperationId: 'bf547ac3-9a35-45b9-ab06-b80b43785154',
          type: 'ADD_VARIABLE',
          state: 'COMPLETED',
          errorMessage: null,
        },
      ],
      parentInstanceId: '6755399441062817',
      rootInstanceId: '6755399441062811',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062833',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.376+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '6755399441062817',
      rootInstanceId: '6755399441062811',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '4503599627376291',
      processId: '2251799813687889',
      processName: 'complexProcess',
      processVersion: 3,
      startDate: '2023-08-14T05:47:07.373+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'complexProcess',
      hasActiveOperation: false,
      operations: [
        {
          id: '18b8a18d-e853-4b3a-b76f-5cefd01d04f0',
          batchOperationId: 'c4e125da-2b5c-42f5-badc-9a78ebd8f006',
          type: 'RESOLVE_INCIDENT',
          state: 'COMPLETED',
          errorMessage: null,
        },
      ],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831341',
      processId: '2251799813686145',
      processName: 'Call Activity Process',
      processVersion: 1,
      startDate: '2023-08-14T05:47:07.361+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'call-activity-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831347',
      processId: '2251799813687891',
      processName: 'called-process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.361+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'called-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '2251799813831341',
      rootInstanceId: '2251799813831341',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831357',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.361+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '2251799813831347',
      rootInstanceId: '2251799813831341',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831363',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.361+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '2251799813831347',
      rootInstanceId: '2251799813831341',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '9007199254749246',
      processId: '2251799813687889',
      processName: 'complexProcess',
      processVersion: 3,
      startDate: '2023-08-14T05:47:07.359+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'complexProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062775',
      processId: '2251799813686145',
      processName: 'Call Activity Process',
      processVersion: 1,
      startDate: '2023-08-14T05:47:07.355+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'call-activity-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062781',
      processId: '2251799813687891',
      processName: 'called-process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.355+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'called-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '6755399441062775',
      rootInstanceId: '6755399441062775',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062791',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.355+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '6755399441062781',
      rootInstanceId: '6755399441062775',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062797',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.355+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '6755399441062781',
      rootInstanceId: '6755399441062775',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '4503599627376266',
      processId: '2251799813687889',
      processName: 'complexProcess',
      processVersion: 3,
      startDate: '2023-08-14T05:47:07.352+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'complexProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831303',
      processId: '2251799813686145',
      processName: 'Call Activity Process',
      processVersion: 1,
      startDate: '2023-08-14T05:47:07.348+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'call-activity-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831309',
      processId: '2251799813687891',
      processName: 'called-process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.348+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'called-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '2251799813831303',
      rootInstanceId: '2251799813831303',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831319',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.348+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '2251799813831309',
      rootInstanceId: '2251799813831303',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831325',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.348+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '2251799813831309',
      rootInstanceId: '2251799813831303',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '9007199254749223',
      processId: '2251799813687889',
      processName: 'complexProcess',
      processVersion: 3,
      startDate: '2023-08-14T05:47:07.345+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'complexProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062739',
      processId: '2251799813686145',
      processName: 'Call Activity Process',
      processVersion: 1,
      startDate: '2023-08-14T05:47:07.339+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'call-activity-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062745',
      processId: '2251799813687891',
      processName: 'called-process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.339+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'called-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '6755399441062739',
      rootInstanceId: '6755399441062739',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062755',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.339+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '6755399441062745',
      rootInstanceId: '6755399441062739',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062761',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.339+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '6755399441062745',
      rootInstanceId: '6755399441062739',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '4503599627376242',
      processId: '2251799813687889',
      processName: 'complexProcess',
      processVersion: 3,
      startDate: '2023-08-14T05:47:07.337+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'complexProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831264',
      processId: '2251799813686145',
      processName: 'Call Activity Process',
      processVersion: 1,
      startDate: '2023-08-14T05:47:07.334+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'call-activity-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831270',
      processId: '2251799813687891',
      processName: 'called-process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.334+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'called-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '2251799813831264',
      rootInstanceId: '2251799813831264',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831280',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.334+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '2251799813831270',
      rootInstanceId: '2251799813831264',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831286',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.334+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '2251799813831270',
      rootInstanceId: '2251799813831264',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '9007199254749200',
      processId: '2251799813687889',
      processName: 'complexProcess',
      processVersion: 3,
      startDate: '2023-08-14T05:47:07.328+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'complexProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062705',
      processId: '2251799813686145',
      processName: 'Call Activity Process',
      processVersion: 1,
      startDate: '2023-08-14T05:47:07.325+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'call-activity-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062711',
      processId: '2251799813687891',
      processName: 'called-process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.325+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'called-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '6755399441062705',
      rootInstanceId: '6755399441062705',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062721',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.325+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '6755399441062711',
      rootInstanceId: '6755399441062705',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '6755399441062727',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.325+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '6755399441062711',
      rootInstanceId: '6755399441062705',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '4503599627376219',
      processId: '2251799813687889',
      processName: 'complexProcess',
      processVersion: 3,
      startDate: '2023-08-14T05:47:07.320+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'complexProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831225',
      processId: '2251799813686145',
      processName: 'Call Activity Process',
      processVersion: 1,
      startDate: '2023-08-14T05:47:07.317+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'call-activity-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: null,
      rootInstanceId: null,
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831231',
      processId: '2251799813687891',
      processName: 'called-process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.317+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'called-process',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '2251799813831225',
      rootInstanceId: '2251799813831225',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831241',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.317+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '2251799813831231',
      rootInstanceId: '2251799813831225',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
    {
      id: '2251799813831247',
      processId: '2251799813687188',
      processName: 'Order process',
      processVersion: 2,
      startDate: '2023-08-14T05:47:07.317+0000',
      endDate: null,
      state: 'INCIDENT',
      bpmnProcessId: 'orderProcess',
      hasActiveOperation: false,
      operations: [],
      parentInstanceId: '2251799813831231',
      rootInstanceId: '2251799813831225',
      callHierarchy: [],
      sortValues: [],
      permissions: [],
    },
  ],
  totalCount: 891,
};

const mockStatistics = [
  {
    activityId: 'eventSubprocess',
    active: 9,
    canceled: 2,
    incidents: 0,
    completed: 0,
  },
  {
    activityId: 'EndEvent_1uddjvh',
    active: 0,
    canceled: 0,
    incidents: 0,
    completed: 9,
  },
  {
    activityId: 'ServiceTask_1daop2o',
    active: 0,
    canceled: 20,
    incidents: 0,
    completed: 0,
  },
  {
    activityId: 'eventSubprocessTask',
    active: 0,
    canceled: 2,
    incidents: 9,
    completed: 0,
  },
];

const mockProcessXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:zeebe="http://camunda.org/schema/zeebe/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_0uef7zo" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="5.3.0">
  <bpmn:process id="eventSubprocessProcess" name="Event Subprocess Process" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1vnazga">
      <bpmn:outgoing>SequenceFlow_0b1strv</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:endEvent id="EndEvent_03acvim">
      <bpmn:incoming>SequenceFlow_0ogmd2w</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_0b1strv" sourceRef="StartEvent_1vnazga" targetRef="ServiceTask_1daop2o" />
    <bpmn:subProcess id="eventSubprocess" name="Event Subprocess" triggeredByEvent="true">
      <bpmn:endEvent id="EndEvent_1uddjvh">
        <bpmn:incoming>SequenceFlow_10d38p0</bpmn:incoming>
      </bpmn:endEvent>
      <bpmn:serviceTask id="eventSubprocessTask" name="Event Subprocess task">
        <bpmn:extensionElements>
          <zeebe:taskDefinition type="eventSupbprocessTask" />
        </bpmn:extensionElements>
        <bpmn:incoming>SequenceFlow_0xk369x</bpmn:incoming>
        <bpmn:outgoing>SequenceFlow_10d38p0</bpmn:outgoing>
      </bpmn:serviceTask>
      <bpmn:sequenceFlow id="SequenceFlow_10d38p0" sourceRef="eventSubprocessTask" targetRef="EndEvent_1uddjvh" />
      <bpmn:sequenceFlow id="SequenceFlow_0xk369x" sourceRef="StartEvent_1u9mwoj" targetRef="eventSubprocessTask" />
      <bpmn:startEvent id="StartEvent_1u9mwoj" name="Interrupting timer">
        <bpmn:outgoing>SequenceFlow_0xk369x</bpmn:outgoing>
        <bpmn:timerEventDefinition>
          <bpmn:timeDuration xsi:type="bpmn:tFormalExpression">PT15S</bpmn:timeDuration>
        </bpmn:timerEventDefinition>
      </bpmn:startEvent>
    </bpmn:subProcess>
    <bpmn:serviceTask id="ServiceTask_1daop2o" name="Parent process task">
      <bpmn:extensionElements>
        <zeebe:taskDefinition type="parentProcessTask" />
      </bpmn:extensionElements>
      <bpmn:incoming>SequenceFlow_0b1strv</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1aytoqp</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:sequenceFlow id="SequenceFlow_1aytoqp" sourceRef="ServiceTask_1daop2o" targetRef="subprocess" />
    <bpmn:subProcess id="subprocess">
      <bpmn:incoming>SequenceFlow_1aytoqp</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0ogmd2w</bpmn:outgoing>
      <bpmn:startEvent id="StartEvent_1dgs6mf">
        <bpmn:outgoing>SequenceFlow_03jyud1</bpmn:outgoing>
      </bpmn:startEvent>
      <bpmn:serviceTask id="ServiceTask_0wfdfpx" name="Subprocess task">
        <bpmn:extensionElements>
          <zeebe:taskDefinition type="subprocessTask" />
        </bpmn:extensionElements>
        <bpmn:incoming>SequenceFlow_03jyud1</bpmn:incoming>
        <bpmn:outgoing>SequenceFlow_1ey1yvq</bpmn:outgoing>
      </bpmn:serviceTask>
      <bpmn:sequenceFlow id="SequenceFlow_03jyud1" sourceRef="StartEvent_1dgs6mf" targetRef="ServiceTask_0wfdfpx" />
      <bpmn:endEvent id="EndEvent_171a64z">
        <bpmn:incoming>SequenceFlow_1ey1yvq</bpmn:incoming>
      </bpmn:endEvent>
      <bpmn:sequenceFlow id="SequenceFlow_1ey1yvq" sourceRef="ServiceTask_0wfdfpx" targetRef="EndEvent_171a64z" />
      <bpmn:subProcess id="SubProcess_006dg16" name="Event Subprocess inside Subprocess" triggeredByEvent="true">
        <bpmn:endEvent id="EndEvent_0dq3i8l">
          <bpmn:incoming>SequenceFlow_0vkqogh</bpmn:incoming>
        </bpmn:endEvent>
        <bpmn:serviceTask id="ServiceTask_0cj9pdg" name="Task in sub-subprocess">
          <bpmn:extensionElements>
            <zeebe:taskDefinition type="subSubprocessTask" />
          </bpmn:extensionElements>
          <bpmn:incoming>SequenceFlow_1c82aad</bpmn:incoming>
          <bpmn:outgoing>SequenceFlow_0vkqogh</bpmn:outgoing>
        </bpmn:serviceTask>
        <bpmn:sequenceFlow id="SequenceFlow_1c82aad" sourceRef="StartEvent_0kpitfv" targetRef="ServiceTask_0cj9pdg" />
        <bpmn:sequenceFlow id="SequenceFlow_0vkqogh" sourceRef="ServiceTask_0cj9pdg" targetRef="EndEvent_0dq3i8l" />
        <bpmn:startEvent id="StartEvent_0kpitfv" name="Timer in sub-subprocess" isInterrupting="false">
          <bpmn:outgoing>SequenceFlow_1c82aad</bpmn:outgoing>
          <bpmn:timerEventDefinition>
            <bpmn:timeCycle xsi:type="bpmn:tFormalExpression">R2/PT5S</bpmn:timeCycle>
          </bpmn:timerEventDefinition>
        </bpmn:startEvent>
      </bpmn:subProcess>
    </bpmn:subProcess>
    <bpmn:sequenceFlow id="SequenceFlow_0ogmd2w" sourceRef="subprocess" targetRef="EndEvent_03acvim" />
  </bpmn:process>
  <bpmn:message id="Message_03ggk3d" name="interruptProcess">
    <bpmn:extensionElements>
      <zeebe:subscription correlationKey="=clientId" />
    </bpmn:extensionElements>
  </bpmn:message>
  <bpmn:message id="Message_1nvz8ri" name="continueProcess">
    <bpmn:extensionElements>
      <zeebe:subscription correlationKey="=clientId" />
    </bpmn:extensionElements>
  </bpmn:message>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="eventSubprocessProcess">
      <bpmndi:BPMNShape id="StartEvent_1vnazga_di" bpmnElement="StartEvent_1vnazga">
        <dc:Bounds x="212" y="252" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_03acvim_di" bpmnElement="EndEvent_03acvim">
        <dc:Bounds x="1202" y="242" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="SubProcess_1u7mexg_di" bpmnElement="eventSubprocess" isExpanded="true">
        <dc:Bounds x="200" y="500" width="388" height="180" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1uddjvh_di" bpmnElement="EndEvent_1uddjvh">
        <dc:Bounds x="512" y="582" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ServiceTask_0h8cwwl_di" bpmnElement="eventSubprocessTask">
        <dc:Bounds x="350" y="560" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartEvent_0d2wour_di" bpmnElement="StartEvent_1u9mwoj">
        <dc:Bounds x="252" y="582" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="228" y="625" width="85" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_10d38p0_di" bpmnElement="SequenceFlow_10d38p0">
        <di:waypoint x="450" y="600" />
        <di:waypoint x="512" y="600" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0xk369x_di" bpmnElement="SequenceFlow_0xk369x">
        <di:waypoint x="288" y="600" />
        <di:waypoint x="350" y="600" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="ServiceTask_1daop2o_di" bpmnElement="ServiceTask_1daop2o">
        <dc:Bounds x="344" y="230" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="SubProcess_1aoke6f_di" bpmnElement="subprocess" isExpanded="true">
        <dc:Bounds x="530" y="85" width="590" height="370" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartEvent_1dgs6mf_di" bpmnElement="StartEvent_1dgs6mf">
        <dc:Bounds x="660.3333333333333" y="167" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ServiceTask_0wfdfpx_di" bpmnElement="ServiceTask_0wfdfpx">
        <dc:Bounds x="740" y="145" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_171a64z_di" bpmnElement="EndEvent_171a64z">
        <dc:Bounds x="882" y="167" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="SubProcess_006dg16_di" bpmnElement="SubProcess_006dg16" isExpanded="true">
        <dc:Bounds x="630" y="270" width="388" height="145" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_0dq3i8l_di" bpmnElement="EndEvent_0dq3i8l">
        <dc:Bounds x="942" y="317" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ServiceTask_0cj9pdg_di" bpmnElement="ServiceTask_0cj9pdg">
        <dc:Bounds x="780" y="295" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartEvent_08k6psq_di" bpmnElement="StartEvent_0kpitfv">
        <dc:Bounds x="682" y="317" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="669" y="360" width="65" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1c82aad_di" bpmnElement="SequenceFlow_1c82aad">
        <di:waypoint x="718" y="335" />
        <di:waypoint x="780" y="335" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0vkqogh_di" bpmnElement="SequenceFlow_0vkqogh">
        <di:waypoint x="880" y="335" />
        <di:waypoint x="942" y="335" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_03jyud1_di" bpmnElement="SequenceFlow_03jyud1">
        <di:waypoint x="696" y="185" />
        <di:waypoint x="740" y="185" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1ey1yvq_di" bpmnElement="SequenceFlow_1ey1yvq">
        <di:waypoint x="840" y="185" />
        <di:waypoint x="882" y="185" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0b1strv_di" bpmnElement="SequenceFlow_0b1strv">
        <di:waypoint x="248" y="270" />
        <di:waypoint x="344" y="270" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1aytoqp_di" bpmnElement="SequenceFlow_1aytoqp">
        <di:waypoint x="444" y="270" />
        <di:waypoint x="530" y="270" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0ogmd2w_di" bpmnElement="SequenceFlow_0ogmd2w">
        <di:waypoint x="1120" y="260" />
        <di:waypoint x="1202" y="260" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

export {
  mockGroupedProcesses,
  mockBatchOperations,
  mockProcessInstances,
  mockStatistics,
  mockProcessXml,
};
