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

const mockComplexProcess = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:zeebe="http://camunda.org/schema/zeebe/1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_0hir062" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Zeebe Modeler" exporterVersion="0.8.0">
  <bpmn:process id="complexProcess" isExecutable="true">
    <bpmn:startEvent id="startEvent">
      <bpmn:outgoing>SequenceFlow_1gvaaro</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:serviceTask id="upperTask" name="Upper task">
      <bpmn:extensionElements>
        <zeebe:taskDefinition type="upperTask" />
        <zeebe:ioMapping>
          <zeebe:input source="=orderId" target="taskOrderId" />
        </zeebe:ioMapping>
      </bpmn:extensionElements>
      <bpmn:incoming>SequenceFlow_0oxsuty</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1kpkmd0</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:serviceTask id="alwaysFailingTask" name="Always failing task">
      <bpmn:extensionElements>
        <zeebe:taskDefinition type="alwaysFailingTask" />
      </bpmn:extensionElements>
      <bpmn:incoming>SequenceFlow_1ti40d3</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0avs127</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:sequenceFlow id="SequenceFlow_1gvaaro" sourceRef="startEvent" targetRef="inclGatewayFork" />
    <bpmn:sequenceFlow id="SequenceFlow_0oxsuty" sourceRef="inclGatewayFork" targetRef="upperTask" />
    <bpmn:sequenceFlow id="SequenceFlow_1ti40d3" sourceRef="inclGatewayFork" targetRef="alwaysFailingTask" />
    <bpmn:parallelGateway id="inclGatewayFork" name="Start 4 threads">
      <bpmn:incoming>SequenceFlow_1gvaaro</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0oxsuty</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_1ti40d3</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_1j24jks</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_12gxvr0</bpmn:outgoing>
    </bpmn:parallelGateway>
    <bpmn:intermediateCatchEvent id="messageCatchEvent" name="message">
      <bpmn:incoming>SequenceFlow_1j24jks</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_10d2jhh</bpmn:outgoing>
      <bpmn:messageEventDefinition messageRef="Message_0hh3rtz" />
    </bpmn:intermediateCatchEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1j24jks" sourceRef="inclGatewayFork" targetRef="messageCatchEvent" />
    <bpmn:exclusiveGateway id="exclusiveGateway" name="Where to go?">
      <bpmn:incoming>SequenceFlow_12gxvr0</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1pzygua</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_1goon4z</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="SequenceFlow_12gxvr0" sourceRef="inclGatewayFork" targetRef="exclusiveGateway" />
    <bpmn:endEvent id="EndEvent_0bkqw71">
      <bpmn:incoming>SequenceFlow_10d2jhh</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:endEvent id="EndEvent_1w1u88d" name="endUp">
      <bpmn:incoming>SequenceFlow_1pzygua</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1pzygua" name="goUp &#62; 5" sourceRef="exclusiveGateway" targetRef="EndEvent_1w1u88d">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">=goUp &gt; 5</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:endEvent id="EndEvent_0tfsfo0" name="endDown">
      <bpmn:incoming>SequenceFlow_1goon4z</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1goon4z" name="goUp &#60; 0" sourceRef="exclusiveGateway" targetRef="EndEvent_0tfsfo0">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">=goUp &lt; 0</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="SequenceFlow_10d2jhh" sourceRef="messageCatchEvent" targetRef="EndEvent_0bkqw71" />
    <bpmn:endEvent id="endEvent">
      <bpmn:incoming>SequenceFlow_1kpkmd0</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1kpkmd0" sourceRef="upperTask" targetRef="endEvent" />
    <bpmn:endEvent id="EndEvent_03hsdez">
      <bpmn:incoming>SequenceFlow_0avs127</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_0avs127" sourceRef="alwaysFailingTask" targetRef="EndEvent_03hsdez" />
  </bpmn:process>
  <bpmn:message id="Message_0hh3rtz" name="clientMessage">
    <bpmn:extensionElements>
      <zeebe:subscription correlationKey="=clientId" />
    </bpmn:extensionElements>
  </bpmn:message>
  <bpmn:message id="Message_1agndym" name="dataReceived">
    <bpmn:extensionElements>
      <zeebe:subscription correlationKey="=clientId" />
    </bpmn:extensionElements>
  </bpmn:message>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="complexProcess">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="startEvent">
        <dc:Bounds x="157" y="177" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ServiceTask_132jrbt_di" bpmnElement="upperTask">
        <dc:Bounds x="386" y="90" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ServiceTask_1meo1hw_di" bpmnElement="alwaysFailingTask">
        <dc:Bounds x="386" y="242" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1gvaaro_di" bpmnElement="SequenceFlow_1gvaaro">
        <di:waypoint x="193" y="195" />
        <di:waypoint x="262" y="195" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0oxsuty_di" bpmnElement="SequenceFlow_0oxsuty">
        <di:waypoint x="287" y="170" />
        <di:waypoint x="287" y="130" />
        <di:waypoint x="386" y="130" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1ti40d3_di" bpmnElement="SequenceFlow_1ti40d3">
        <di:waypoint x="287" y="220" />
        <di:waypoint x="287" y="282" />
        <di:waypoint x="386" y="282" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="ParallelGateway_0n4dl17_di" bpmnElement="inclGatewayFork">
        <dc:Bounds x="262" y="170" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="322" y="188" width="73" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="IntermediateCatchEvent_0opz4tk_di" bpmnElement="messageCatchEvent">
        <dc:Bounds x="418" y="410" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="414" y="453" width="45" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1j24jks_di" bpmnElement="SequenceFlow_1j24jks">
        <di:waypoint x="287" y="220" />
        <di:waypoint x="287" y="428" />
        <di:waypoint x="418" y="428" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="ExclusiveGateway_01pou5h_di" bpmnElement="exclusiveGateway" isMarkerVisible="true">
        <dc:Bounds x="398" y="558" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="348" y="550" width="66" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_12gxvr0_di" bpmnElement="SequenceFlow_12gxvr0">
        <di:waypoint x="287" y="220" />
        <di:waypoint x="287" y="583" />
        <di:waypoint x="398" y="583" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_0bkqw71_di" bpmnElement="EndEvent_0bkqw71">
        <dc:Bounds x="552" y="410" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1w1u88d_di" bpmnElement="EndEvent_1w1u88d">
        <dc:Bounds x="540" y="516" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="542" y="559" width="34" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1pzygua_di" bpmnElement="SequenceFlow_1pzygua">
        <di:waypoint x="423" y="558" />
        <di:waypoint x="423" y="534" />
        <di:waypoint x="540" y="534" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="440" y="516" width="45" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_0tfsfo0_di" bpmnElement="EndEvent_0tfsfo0">
        <dc:Bounds x="540" y="623" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="535" y="666" width="47" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1goon4z_di" bpmnElement="SequenceFlow_1goon4z">
        <di:waypoint x="423" y="608" />
        <di:waypoint x="423" y="641" />
        <di:waypoint x="540" y="641" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="443" y="647" width="45" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_10d2jhh_di" bpmnElement="SequenceFlow_10d2jhh">
        <di:waypoint x="454" y="428" />
        <di:waypoint x="552" y="428" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="endEvent" bpmnElement="endEvent">
        <dc:Bounds x="552" y="112" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1kpkmd0_di" bpmnElement="SequenceFlow_1kpkmd0">
        <di:waypoint x="486" y="130" />
        <di:waypoint x="552" y="130" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_03hsdez_di" bpmnElement="EndEvent_03hsdez">
        <dc:Bounds x="552" y="264" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0avs127_di" bpmnElement="SequenceFlow_0avs127">
        <di:waypoint x="486" y="282" />
        <di:waypoint x="552" y="282" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

export {mockComplexProcess};
