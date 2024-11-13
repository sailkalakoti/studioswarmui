import {
  Node,
} from "@xyflow/react";


export interface NewNode extends Node {
  id: string;
  nodeId: number;
  type: string;
  position: { x: number; y: number };
  data: { label?: string };
  nodeType?: string;
}

export interface NodeDetails {
  label?: string;
  id?: number;
  description?: string;
}