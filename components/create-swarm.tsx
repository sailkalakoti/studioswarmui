"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  ChevronRight,
  Zap,
  Database,
  User,
  Save,
  Play,
} from "lucide-react";
import { FlowchartComponent } from "@/components/workflow/page";
import { useDnD } from "./DnDContext";
import { useSidebar } from "./ui/sidebar";
import ChatContainer from "./ChatContainer";
import axiosInstance from "@/lib/apiService";
import { useMutation, useQuery } from "react-query";

const getAgent = async ({ queryKey }) => {
  const { data } = await axiosInstance.get(queryKey[0]);
  return data;
}

const getSwarmData = async ({ queryKey }) => {
  const { data } = await axiosInstance.get(queryKey[0]);
  return data;
}

const createSwarm = async (payload) => {
  const { data } = await axiosInstance.post('/swarms/', payload);
  return data;
}

export function CreateSwarm({ id }) {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const { setType, setNodeType, setNodeDetails, allNodes, allEdges, setAllNodes, setAllEdges } = useDnD();
  const [swarmName, setSwarmName] = useState("");
  const [swarmDescription, setSwarmDescription] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    standardNodes: true,
    agents: true,
  });
  const [existingNodes, setExistingNodes] = useState([]);
  const [existingEdges, setExistingEdges] = useState([]);
  const isCreate = id === 'create';

  const { data: agentData } = useQuery('/agents/', getAgent);

  const { data: swarmData } = useQuery(!isCreate ? '/swarms/'+id : null, getSwarmData);

  const [showChatBubble, setShowChatBubble] = useState(false);

  const createSwarmMutation = useMutation(createSwarm, {
  });

  const { setOpen } = useSidebar();
  useEffect(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (Object?.keys(swarmData || {})) {
      const {
        nodes,
        edges,
      } = swarmData?.graph || {};
      setExistingEdges(edges);
      setExistingNodes(nodes);
    }
  }, [swarmData]);

  const standardNodes = [
    {
      icon: null,
      label: "Start Node",
      id: 'startNode',
    },
    {
      icon: null,
      label: "End Node",
      id: 'endNode',
    },
  ];
  const oldNodes = [
    {
      icon: <Database className="h-4 w-4 text-blue-500" />,
      label: "Data Source",
      id: 'dataSource',
    },
    {
      icon: <Zap className="h-4 w-4 text-yellow-500" />,
      label: "Process",
      id: 'process',
    },
    {
      icon: <Zap className="h-4 w-4 text-yellow-500" />,
      label: "Chat Input Node",
      id: "chatInput"
    },
    {
      icon: <Zap className="h-4 w-4 text-yellow-500" />,
      label: "Prompt Node",
      id: "prompt",
    },
    {
      icon: <Zap className="h-4 w-4 text-yellow-500" />,
      label: "OpenAI Node",
      id: "openai"
    },
    {
      icon: <Zap className="h-4 w-4 text-yellow-500" />,
      label: "Chat Output Node",
      id: "chatOutput"
    }
  ];

  const agentNodes = [
    {
      icon: <User className="h-4 w-4 text-green-500" />,
      label: "Analysis Agent",
    },
    {
      icon: <User className="h-4 w-4 text-purple-500" />,
      label: "Decision Agent",
    }
  ]

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    type: string,
    nodeType: string,
    nodeItem: object,
  ) => {
    setType(nodeType);
    setNodeType(nodeType)
    setNodeDetails(nodeItem);
    event.dataTransfer.effectAllowed = "move";
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSave = () => {

    createSwarmMutation.mutate({
      name: swarmName,
      description: swarmDescription,
      graph: {
        nodes: allNodes,
        edges: allEdges,
      }
    });
    console.log("Saving swarm:", {
      name: swarmName,
      description: swarmDescription,
    });
    setIsSaveDialogOpen(false);
  };

  const handleRun = (mode: "normal" | "loop") => {
    // Here you would typically start the swarm execution
    console.log(`Running swarm in ${mode} mode`);
  };

  const onRunSwarm = () => {
    setShowChatBubble(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {/* Header */}
      {/* <Header /> */}

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
          <nav className="mt-8">
            <div className="px-4 mb-4">
              <button
                onClick={() => toggleSection("standardNodes")}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-semibold">Standard Nodes</span>
                {expandedSections.standardNodes ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedSections.standardNodes && (
                <div className="mt-2 space-y-2">
                  {standardNodes?.map(nodeItem => (
                    <div
                      key={nodeItem.id}
                      className="flex items-center space-x-2 cursor-move p-2 cursor-move p-2"
                      draggable
                      onDragStart={(event) => onDragStart(event, nodeItem?.id, "standardNodes", nodeItem)}
                    >
                      {nodeItem?.icon}
                      <span>{nodeItem.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-4 mb-4">
              <button
                onClick={() => toggleSection("agents")}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-semibold">Agents</span>
                {expandedSections.agents ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {agentData?.map(agentItem => (
                <div
                  className="flex items-center space-x-2 cursor-move p-2 cursor-move"
                  draggable
                  key={agentItem.agentid}
                  onDragStart={(event) => onDragStart(event, agentItem?.agentid, "agent", {
                    label: agentItem?.name,
                    id: agentItem?.agentid,
                    ...agentItem,
                    icon: <User className="h-4 w-4 text-green-500" />,
                  })}
                >
                  <User className="h-4 w-4 text-green-500" />
                  <span>{agentItem?.name}</span>
                </div>
              ))}

            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Swarm</h1>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={() => setIsSaveDialogOpen(true)}
                variant={"primary"}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant={'secondary'} onClick={onRunSwarm}>
                <Play className="h-4 w-4 mr-2" />
                Run
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <Card className="mb-8">
            <CardContent className="h-[80vh] pt-6 bg-transparent rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <FlowchartComponent nodes={existingNodes} edges={existingEdges} />
            </CardContent>
          </Card>

          {/* Save Dialog */}
          <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Swarm</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="swarm-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Swarm Name
                  </label>
                  <Input
                    id="swarm-name"
                    value={swarmName}
                    onChange={(e) => setSwarmName(e.target.value)}
                    placeholder="Enter swarm name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="swarm-description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <Textarea
                    id="swarm-description"
                    value={swarmDescription}
                    onChange={(e) => setSwarmDescription(e.target.value)}
                    placeholder="Enter swarm description"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setIsSaveDialogOpen(false)}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant="primary"
                >
                  Save Swarm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
      {showChatBubble && <ChatContainer />}
    </div>
  );
}
