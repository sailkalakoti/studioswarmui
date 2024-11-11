"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const DnDContext = createContext<{
  type: string,
  nodeType: string,
  nodeDetails: object,
  setType: Function,
  setNodeType: Function,
  setNodeDetails: Function,
  allNodes: [];
  setAllNodes: Function,
  allEdges: [];
  setAllEdges: Function;
}>({
  type: "",
  nodeType: "",
  nodeDetails: {},
  setType: () => {},
  setNodeType: () => {},
  setNodeDetails: () => {},
  allNodes: [],
  allEdges: [],
  setAllNodes: () => {},
  setAllEdges: () => {},
});

export const DnDProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<string>("");
  const [nodeType, setNodeType] = useState<string>("");
  const [nodeDetails, setNodeDetails] = useState({});
  const [allNodes, setAllNodes] = useState([]);
  const [allEdges, setAllEdges] = useState([]);

  return (
    <DnDContext.Provider value={{
      type,
      setType,
      nodeType,
      setNodeType,
      nodeDetails,
      setNodeDetails,
      allNodes,
      setAllNodes,
      allEdges,
      setAllEdges,
    }}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
};
