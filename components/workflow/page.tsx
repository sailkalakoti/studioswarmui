"use client";

import React, { useCallback, useRef } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  MarkerType,
} from "@xyflow/react";
import {
  ChatInputNode,
  ChatOutputNode,
  OpenAINode,
  PromptNode,
  CustomNode,
  AgentNode,
} from "@/components/CustomNode";
import { DnDProvider, useDnD } from "@/components/DnDContext";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";

import "@xyflow/react/dist/style.css";
import BidirectionalEdge from "@/components/BidirectionalEdge";

const nodeTypes: NodeTypes = {
  chatInput: ChatInputNode,
  prompt: PromptNode,
  openai: OpenAINode,
  chatOutput: ChatOutputNode,
  customNode: CustomNode,
  startNode: CustomNode,
  endNode: CustomNode,
  analysisAgent: CustomNode,
  decisionAgent: CustomNode,
  agent: AgentNode,
};

interface DropEvent extends React.DragEvent {
  clientX: number;
  clientY: number;
}

interface NewNode extends Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label?: string };
  nodeType?: string;
}

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

const Topbar = () => {
  return (
    <div className="w-full bg-stone-100 text-gray-800 py-2 px-4 border-b border-stone-200 shadow-md flex justify-between items-center">
      <div className="text-lg font-bold">Dashboard</div>
      <div className="flex gap-4">
        <Button variant="outline" size="sm">
          Button 1
        </Button>
        <Button size="sm">Button 2</Button>
      </div>
    </div>
  );
};

const checkIfBothNodeAgent = (sourceId:string, targetId: string, nodes: any): boolean => {
  const sourceType = nodes.filter((nodeItem: any) => nodeItem.id === sourceId)?.[0].nodeType;
  const targetType = nodes.filter((nodeItem: any) => nodeItem.id === targetId)?.[0].nodeType;
  if (sourceType === targetType && sourceType === 'agent')
    return true;
  return false;
}

export const FlowchartComponent: React.FC = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const { type, nodeType, nodeDetails } = useDnD();
  const onConnect = useCallback(
    ({
      source,
      target,
      sourceHandle,
      targetHandle,
    }: {
      source: string;
      target: string;
      sourceHandle: string | null;
      targetHandle: string | null;
    }) => {

      return setEdges((eds) =>
        nodes
          .filter((node) => node.id === source)
          .reduce((eds, node) => {
            const isAgentToAgent = checkIfBothNodeAgent(source, target, nodes);

            const newEdge = {
              source: node.id,
              target,
              sourceHandle: sourceHandle,
              targetHandle: targetHandle,
              // animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#4F46E5',
              },
              ...(isAgentToAgent ? {label: "Handoff"} : {}),
              style: {
                strokeWidth: 2,
                stroke: '#4F46E5',
              },
            }
            return addEdge(
              newEdge,
              eds,
            );
          }, eds),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DropEvent) => {
      event.preventDefault();

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: NewNode = {
        id: getId(),
        type,
        position,
        data: initialNodes.find((node) => node.type === type)?.data || nodeDetails,
        nodeType: nodeType,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes, type],
  );

  const nodeClassName = (node) => node.type;

  return (
    <div
      className="reactflow-wrapper bg-stone-50 w-full h-full"
      ref={reactFlowWrapper}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        edgeTypes={{
          // chatInput: BidirectionalEdge,
          // prompt: BidirectionalEdge,
          // openai: BidirectionalEdge,
          // chatOutput: BidirectionalEdge,
          bidirectional: BidirectionalEdge,
        }}
        attributionPosition="bottom-right"
      >
        <Background />
        <Controls />
        <MiniMap zoomable pannable nodeClassName={nodeClassName} />
        <Panel position="bottom-right">
          <div className="flex gap-2 mr-56 mb-2">
            <Button variant="outline" size="icon">
              🚀
            </Button>
            <Button variant="outline" size="icon">
              🔥
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <div className="h-screen w-screen bg-stone-50">
          <div className="dndflow">
            <Sidebar />
            <div className="h-screen flex-1 flex flex-col">
              <Topbar />
              <FlowchartComponent />
            </div>
          </div>
        </div>
      </DnDProvider>
    </ReactFlowProvider>
  );
};

export default DashboardPage;
