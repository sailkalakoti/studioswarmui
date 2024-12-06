import React, { useState } from "react";
import {
  getBezierPath,
  useStore,
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  type ReactFlowState,
  useReactFlow,
} from "@xyflow/react";
import { Trash } from "lucide-react";

export default function BidirectionalEdge({
  id,
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
  const { deleteElements } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);

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
  let labelY = (sourceY + targetY) / 2;
  let deleteButtonY = labelY - 35;

  if (isBiDirectionEdge) {
    const offset = sourceX < targetX ? 75 : -75;
    const centerX = (sourceX + targetX) / 2;
    const centerY = (sourceY + targetY) / 2;
    path = `M ${sourceX} ${sourceY} Q ${centerX} ${centerY + offset} ${targetX} ${targetY}`;
    
    // Adjust positions for curved edges
    labelY = centerY + (offset / 2);
    deleteButtonY = labelY - 35;
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

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteElements({ edges: [{ id }] });
  };

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
            zIndex: 1,
          }}
          className="px-2 py-1 bg-white rounded-md text-xs font-medium text-[#002856] shadow-sm border border-[#002856]/10"
        >
          {label}
        </div>
      </EdgeLabelRenderer>

      {isHovered && (
        <foreignObject
          width={30}
          height={30}
          x={(sourceX + targetX) / 2 - 15}
          y={deleteButtonY}
          className="edge-delete-button"
          style={{ 
            zIndex: 9999,
            pointerEvents: 'all'
          }}
        >
          <div 
            className="w-full h-full flex items-center justify-center"
            onMouseEnter={(e) => {
              e.stopPropagation();
              setIsHovered(true);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              setIsHovered(false);
            }}
          >
            <button
              className="w-6 h-6 rounded-full bg-white shadow-lg hover:bg-red-50 flex items-center justify-center border border-gray-200 absolute"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(e);
              }}
              style={{ 
                pointerEvents: 'all',
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%'
              }}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </foreignObject>
      )}

      <path
        className="react-flow__edge-interaction"
        d={path}
        strokeWidth={20}
        stroke="transparent"
        fill="none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </>
  );
}
