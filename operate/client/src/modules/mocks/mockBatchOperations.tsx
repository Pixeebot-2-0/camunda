/*
 * Copyright Camunda Services GmbH
 *
 * BY INSTALLING, DOWNLOADING, ACCESSING, USING, OR DISTRIBUTING THE SOFTWARE, YOU INDICATE YOUR ACCEPTANCE TO AND ARE ENTERING INTO A CONTRACT WITH, THE LICENSOR ON THE TERMS SET OUT IN THIS AGREEMENT. IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT USE THE SOFTWARE. IF YOU ARE RECEIVING THE SOFTWARE ON BEHALF OF A LEGAL ENTITY, YOU REPRESENT AND WARRANT THAT YOU HAVE THE ACTUAL AUTHORITY TO AGREE TO THE TERMS AND CONDITIONS OF THIS AGREEMENT ON BEHALF OF SUCH ENTITY.
 * "Licensee" means you, an individual, or the entity on whose behalf you receive the Software.
 *
 * Permission is hereby granted, free of charge, to the Licensee obtaining a copy of this Software and associated documentation files to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject in each case to the following conditions:
 * Condition 1: If the Licensee distributes the Software or any derivative works of the Software, the Licensee must attach this Agreement.
 * Condition 2: Without limiting other conditions in this Agreement, the grant of rights is solely for non-production use as defined below.
 * "Non-production use" means any use of the Software that is not directly related to creating products, services, or systems that generate revenue or other direct or indirect economic benefits.  Examples of permitted non-production use include personal use, educational use, research, and development. Examples of prohibited production use include, without limitation, use for commercial, for-profit, or publicly accessible systems or use for commercial or revenue-generating purposes.
 *
 * If the Licensee is in breach of the Conditions, this Agreement, including the rights granted under it, will automatically terminate with immediate effect.
 *
 * SUBJECT AS SET OUT BELOW, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * NOTHING IN THIS AGREEMENT EXCLUDES OR RESTRICTS A PARTY’S LIABILITY FOR (A) DEATH OR PERSONAL INJURY CAUSED BY THAT PARTY’S NEGLIGENCE, (B) FRAUD, OR (C) ANY OTHER LIABILITY TO THE EXTENT THAT IT CANNOT BE LAWFULLY EXCLUDED OR RESTRICTED.
 */

const mockBatchOperations = [
  {
    id: '86143d2a-dee6-45b4-953b-49d0f56f2469',
    name: null,
    type: 'ADD_VARIABLE',
    startDate: '2021-07-14T14:04:12.813+0200',
    endDate: '2021-07-14T14:04:20.909+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626264260909', '1626264252813'],
  },
  {
    id: 'b7247381-2a89-4405-a3c6-8f2ea636e613',
    name: null,
    type: 'RESOLVE_INCIDENT',
    startDate: '2021-07-14T14:04:07.225+0200',
    endDate: '2021-07-14T14:04:14.874+0200',
    instancesCount: 1,
    operationsTotalCount: 4,
    operationsFinishedCount: 4,
    sortValues: ['1626264254874', '1626264247225'],
  },
  {
    id: '159bdca5-2a66-424c-af1a-3245f735fad0',
    name: null,
    type: 'RESOLVE_INCIDENT',
    startDate: '2021-07-14T14:04:07.743+0200',
    endDate: '2021-07-14T14:04:14.862+0200',
    instancesCount: 1,
    operationsTotalCount: 4,
    operationsFinishedCount: 4,
    sortValues: ['1626264254862', '1626264247743'],
  },
  {
    id: 'b6edce38-c092-4381-a159-6cd495f16d7f',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:13.619+0200',
    endDate: '2021-07-12T15:04:29.142+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095069142', '1626094993619'],
  },
  {
    id: '9a22491a-f881-4b1f-a4c6-bb886b5c2d80',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:14.065+0200',
    endDate: '2021-07-12T15:04:29.108+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095069108', '1626094994065'],
  },
  {
    id: '73b07ca6-7f14-4cfc-adcc-4427e2f6d67a',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:13.751+0200',
    endDate: '2021-07-12T15:04:29.071+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095069071', '1626094993751'],
  },
  {
    id: '52741338-9393-4057-b681-0de421c5147f',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:12.125+0200',
    endDate: '2021-07-12T15:04:22.489+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095062489', '1626094992125'],
  },
  {
    id: '2bd9abd8-d01c-43b6-8a76-d09d602768f2',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:11.894+0200',
    endDate: '2021-07-12T15:04:22.468+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095062468', '1626094991894'],
  },
  {
    id: '4acf357f-ca41-490d-8aa1-7a471eadd07a',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:14.219+0200',
    endDate: '2021-07-12T15:04:17.701+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095057701', '1626094994219'],
  },
  {
    id: 'f360aa8e-f1b0-48d8-bfb2-a3ec6cc73086',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:13.864+0200',
    endDate: '2021-07-12T15:04:17.677+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095057677', '1626094993864'],
  },
  {
    id: '2f69611d-3440-4605-9a97-b899d920a21b',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:13.919+0200',
    endDate: '2021-07-12T15:04:17.650+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095057650', '1626094993919'],
  },
  {
    id: 'a2dfc418-b6db-4f8c-9592-6c9560e014b5',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:14.371+0200',
    endDate: '2021-07-12T15:04:17.630+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095057630', '1626094994371'],
  },
  {
    id: 'f825f84a-0a73-4d15-9b50-6e1c8fb63199',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:11.980+0200',
    endDate: '2021-07-12T15:04:17.485+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095057485', '1626094991980'],
  },
  {
    id: '05215e57-73c2-4a04-8458-cb6a7fd070e3',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:12.323+0200',
    endDate: '2021-07-12T15:04:17.465+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095057465', '1626094992323'],
  },
  {
    id: '56733b40-ba18-45c0-8bd7-1d79e8ed613e',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:13.056+0200',
    endDate: '2021-07-12T15:04:17.432+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095057432', '1626094993056'],
  },
  {
    id: '68fbf455-726f-45bf-b7af-d72b43047bfc',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:12.997+0200',
    endDate: '2021-07-12T15:04:17.405+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095057405', '1626094992997'],
  },
  {
    id: '2b60edb8-f297-43a7-801f-29db7b6d496f',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:12.086+0200',
    endDate: '2021-07-12T15:04:17.383+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095057383', '1626094992086'],
  },
  {
    id: '9884f77e-dfec-4472-ac90-0c41a522956d',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:13.299+0200',
    endDate: '2021-07-12T15:04:17.362+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095057362', '1626094993299'],
  },
  {
    id: 'b165a789-fd78-4641-8138-3b1da5be5eaf',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:12.389+0200',
    endDate: '2021-07-12T15:04:17.327+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095057327', '1626094992389'],
  },
  {
    id: '0a9ab6b1-88cf-4049-abd3-b526faa905f7',
    name: null,
    type: 'CANCEL_PROCESS_INSTANCE',
    startDate: '2021-07-12T15:03:11.534+0200',
    endDate: '2021-07-12T15:04:17.296+0200',
    instancesCount: 1,
    operationsTotalCount: 1,
    operationsFinishedCount: 1,
    sortValues: ['1626095057296', '1626094991534'],
  },
];

export {mockBatchOperations};
