import React from "react";
import {
  getBezierPath,
  useStore,
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  type ReactFlowState,
} from "@xyflow/react";

export default function BidirectionalEdge({
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  ...rest
}: EdgeProps) {
  const isBiDirectionEdge = useStore((s: ReactFlowState) => {
    const edgeExists = s.edges.some(
      (e) =>
        (e.source === target && e.target === source) ||
        (e.target === source && e.source === target),
    );
    return edgeExists;
  });

  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  let path = "";
  let labelX = (sourceX + targetX) / 2;
  let labelY = (sourceY + targetY) / 2 - 10;

  if (isBiDirectionEdge) {
    const offset = sourceX < targetX ? 75 : -75;
    const centerX = (sourceX + targetX) / 2;
    const centerY = (sourceY + targetY) / 2;
    path = `M ${sourceX} ${sourceY} Q ${centerX} ${centerY + offset} ${targetX} ${targetY}`;
    
    // Adjust label position for curved edges
    labelY = centerY + (offset / 2); // Position label at curve peak
  } else {
    [path] = getBezierPath({
      ...edgePathParams,
      curvature: 0.3
    });
  }

  // Get the source node from the store to check its label
  const sourceNode = useStore((s: ReactFlowState) => 
    s.nodes.find(n => n.id === source)
  );

  // Determine label based on source node's label
  const label = sourceNode?.data?.label === "Start" ? "Begin" : "Handoff";

  return (
    <>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#002856" />
          <stop offset="50%" stopColor="#1a4c8b" />
          <stop offset="100%" stopColor="#0071B2" />
        </linearGradient>
        
        <marker
          id="custom-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 z"
            fill="#1a4c8b"
            className="transition-all duration-300"
          />
        </marker>
      </defs>

      <BaseEdge 
        path={path} 
        {...rest}
        className="animated-edge-path"
        style={{
          strokeWidth: 2,
          stroke: 'url(#gradient)',
        }}
        markerEnd="url(#custom-arrow)"
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'none',
          }}
          className="px-2 py-1 bg-white rounded-md text-xs font-medium text-[#002856] shadow-sm border border-[#002856]/10"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
