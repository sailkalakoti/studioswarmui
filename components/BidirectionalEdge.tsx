import React from "react";
import {
  getBezierPath,
  useStore,
  BaseEdge,
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

  if (isBiDirectionEdge) {
    const offset = sourceX < targetX ? 50 : -50;
    const centerX = (sourceX + targetX) / 2;
    const centerY = (sourceY + targetY) / 2;
    path = `M ${sourceX} ${sourceY} Q ${centerX} ${centerY + offset} ${targetX} ${targetY}`;
  } else {
    [path] = getBezierPath({
      ...edgePathParams,
      curvature: 0.2
    });
  }

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
        style={{
          strokeWidth: 2,
          stroke: 'url(#gradient)',
        }}
        markerEnd="url(#custom-arrow)"
      />
    </>
  );
}
