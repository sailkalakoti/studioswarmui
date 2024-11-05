import { createContext, useContext, useState, ReactNode } from "react";

const DnDContext = createContext<{
  type: string,
  nodeType: string,
  nodeDetails: object,
  setType: Function,
  setNodeType: Function,
  setNodeDetails: Function,
}>({
  type: "",
  nodeType: "",
  nodeDetails: {},
  setType: () => {},
  setNodeType: () => {},
  setNodeDetails: () => {},
});

export const DnDProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<string>("");
  const [nodeType, setNodeType] = useState<string>("");
  const [nodeDetails, setNodeDetails] = useState({});

  return (
    <DnDContext.Provider value={{
      type,
      setType,
      nodeType,
      setNodeType,
      nodeDetails,
      setNodeDetails,
    }}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
};
