"use client";

import { useEffect, useState, useCallback } from "react";
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
  User,
  Save,
  Play,
  Upload,
  Download,
  GripVertical,
  X,
} from "lucide-react";
import { FlowchartComponent } from "@/components/workflow/page";
import { useDnD } from "./DnDContext";
import axiosInstance from "@/lib/apiService";
import { useMutation, useQuery } from "react-query";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import useDebounce, { downloadFile, useApiMutation, useFetchData } from "@/lib/utils";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { NewNode, NodeDetails } from "@/lib/types";
import { Edge } from "@xyflow/react";
import constants from "@/constants";
import BreadCrumbs from "./Breadcrumbs";
import ResizableDrawer from "./ResizeableDrawer";
import { useKeyPress } from '@xyflow/react';
import { useReactFlow, useOnSelectionChange } from '@xyflow/react';

const createSwarm = async (payload) => {
  if (payload.id !== 'create') {
    const { data } = await axiosInstance.put('/swarms/' + payload.id, payload.data);
    return data;
  }
  const { data } = await axiosInstance.post('/swarms/', payload.data);
  return data;
}

export function CreateSwarm({ id }) {
  const { FORM_VALIDATION_MESSAGES, PAGE_SUBTITLES } = constants;
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const { setType, setNodeType, setNodeDetails, allNodes, allEdges } = useDnD();
  const [swarmName, setSwarmName] = useState("");
  const [swarmDescription, setSwarmDescription] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    standardNodes: true,
    agents: true,
  });
  const [formError, setFormError] = useState('');
  const [existingNodes, setExistingNodes] = useState<NewNode[]>([]);
  const [existingEdges, setExistingEdges] = useState<Edge[]>([]);
  const isCreate = id === 'create';
  const router = useRouter();

  const { data, isLoading: isAgentListLoading }: {
    data: [];
    isLoading: boolean;
  } = useFetchData('/agents/?limit=100');
  const { data: agentData }: any = data || {};
  const { data: swarmData }: { data: any } = useFetchData(!isCreate ? '/swarms/' + id : null);

  const [showChatBubble, setShowChatBubble] = useState(false);
  const [timestampToDownload, setTimestampToDownload] = useState('');
  const debouncedSwarmName = useDebounce(swarmName, 300);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const [runTriggered, setRunTriggered] = useState(false);
  const [portToRun, setPortToRun] = useState(0);

  const [swarmTags, setSwarmTags] = useState<string[]>([]);

  // Add state for selected elements
  const [selectedElements, setSelectedElements] = useState<{ nodes: string[], edges: string[] }>({ 
    nodes: [], 
    edges: [] 
  });

  // Get the React Flow instance
  const { setNodes, setEdges } = useReactFlow();

  // Track selected elements
  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedElements({
        nodes: nodes.map(node => node.id),
        edges: edges.map(edge => edge.id)
      });
    },
  });

  // Move this up, before the useEffect that uses it
  const deleteKeyPressed = useKeyPress(['Backspace', 'Delete']);

  // Handle deletion
  useEffect(() => {
    if (deleteKeyPressed && (selectedElements.nodes.length > 0 || selectedElements.edges.length > 0)) {
      setNodes((nodes) => nodes.filter((node) => !selectedElements.nodes.includes(node.id)));
      setEdges((edges) => edges.filter((edge) => !selectedElements.edges.includes(edge.id)));
    }
  }, [deleteKeyPressed, selectedElements, setNodes, setEdges]);

  // Handle node deletion and cleanup connected edges
  const onNodesDelete = useCallback((nodesToDelete) => {
    setEdges((edges) => 
      edges.filter((edge) => 
        !nodesToDelete.some(
          (node) => node.id === edge.source || node.id === edge.target
        )
      )
    );
  }, [setEdges]);

  useEffect(() => {
    console.log('Tags updated:', swarmTags);
  }, [swarmTags]);

  const {
    data: swarmExists,
    isLoading: isSwarmExistsLoading,
  }: {
    data: boolean;
    isLoading: boolean;
  } = useFetchData(isCreate && debouncedSwarmName?.length > 0 ? '/swarms/exists?name=' + debouncedSwarmName : null);

  useEffect(() => {
    if (swarmName?.includes(" ")) {
      setFormError(FORM_VALIDATION_MESSAGES.SPACE_NOT_ALLOWED)
    } else {
      setFormError("");
    }
  }, [swarmName]);

  const createSwarmMutation = useMutation(createSwarm, {
    onSuccess: () => {
      toast.success(isCreate ? 'Created new Swarm' : 'Updated Swarm')
      router.push('/swarms');
    }
  });

  const publishSwarmMutation = useApiMutation('/swarm_execution/generate', 'POST', {
    onSuccess: (data: any) => {
      toast.success("Swarm published");
      const downloadLink = data?.codebase_zip_path || "";
      let match = downloadLink.match(/\d+/);
      setTimestampToDownload(match[0]);
    },
  });

  const { data: swarmDownloadData, isLoading: isDownloadLoading } = useFetchData(
    '/swarm_execution/download/' + timestampToDownload,
    {},
    'blob',
    { enabled: triggerDownload }
  );

  const runSwarmMutation = useApiMutation("/swarm_execution/spawn/", "POST", {
    onSuccess: (data: any) => {
      setPortToRun(data.port);
      setShowChatBubble(true);
      toast.success("Server started on : ", data.port);
      setRunTriggered(true);
    }
  });

  useEffect(() => {
    if (isDownloadLoading) {
      setTriggerDownload(false);
    }

    if (!isDownloadLoading && swarmDownloadData) {
      downloadFile(swarmDownloadData, `${timestampToDownload}.zip`);
    }
  }, [swarmDownloadData, isDownloadLoading]);

  useEffect(() => {
    if (!isSaveDialogOpen && isCreate) {
      setSwarmName('');
      setSwarmDescription('');
      setSwarmTags([]);
    }
  }, [isSaveDialogOpen, isCreate]);

  useEffect(() => {
    if (Object?.keys(swarmData || {})?.length > 0) {
      const {
        nodes,
        edges,
      } = swarmData?.metadata_info || {};
      setExistingEdges(edges);
      setExistingNodes(nodes);
      setSwarmName(swarmData?.name);
      setSwarmDescription(swarmData?.description);
      if (swarmData?.tags) {
        setSwarmTags(swarmData.tags);
      }
    }
  }, [swarmData]);

  const standardNodes = [
    {
      label: "Start",
      id: 0,
    },
  ];

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    nodeItem: NodeDetails,
  ) => {
    setType(nodeType);
    setNodeType(nodeType)
    setNodeDetails(nodeItem);
    event.dataTransfer.effectAllowed = "move";
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const onSaveTrigger = (event) => {
    console.log('Save dialog triggered', { isCreate, isSaveDialogOpen });
    if (!isCreate) {
      event?.stopPropagation();
      event?.preventDefault();
      handleSave();
      return;
    }
    if (isCreate) {
      setSwarmName('');
      setSwarmDescription('');
      setSwarmTags([]);
    }
    setIsSaveDialogOpen(true);
  }

  const onPublishSwarm = () => {
    publishSwarmMutation.mutate({
      swarm_id: id
    });
  }

  const onDownloadSwarm = () => {
    setTriggerDownload(true);
  }

  const handleSave = () => {
    createSwarmMutation.mutate({
      id,
      data: {
        name: swarmName,
        description: swarmDescription,
        tags: swarmTags,
        graph: {
          nodes: allNodes?.map((nodeItem: any) => ({
            id: Number(nodeItem.id),
            name: nodeItem?.data?.label,
            description: nodeItem?.data?.description || "",
            type: nodeItem?.type || "",
            edges: allEdges
              ?.filter((edgeItem: any) => edgeItem.source === nodeItem.id)
              ?.map((edgeItem: any) => Number(edgeItem?.target)),
          })),
        },
        metadata_info: {
          nodes: allNodes,
          edges: allEdges,
        },
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
    if (portToRun) {
      setShowChatBubble(true);
      return;
    }
    runSwarmMutation.mutate({
      instance_id: timestampToDownload
    })
  }

  const onChatClose = () => {
    setShowChatBubble(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Toaster toastOptions={{ position: "bottom-right" }} />
      
      {/* Header section */}
      <div className="bg-gray-50">
        <div className="px-8 py-4 pt-6">
          <div className="mb-4">
            <BreadCrumbs
              path={[
                {
                  label: "Dashboard",
                  href: "/dashboard",
                },
                {
                  label: "Swarms",
                  href: "/swarms",
                },
                {
                  label: isCreate ? "Create Swarm" : swarmName,
                }
              ]}
            />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{isCreate ? "Assemble Your Swarm" : swarmName}</h1>
              <p className="text-sm text-gray-600 mb-4">
                {isCreate ? PAGE_SUBTITLES['swarms'] : swarmDescription}
              </p>
            </div>

            {/* Right side content */}
            <div className="flex flex-col items-end gap-4">
              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={onSaveTrigger}
                  variant={"primary"}
                  disabled={!allNodes?.length}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  disabled={isCreate}
                  variant="secondary"
                  onClick={onPublishSwarm}
                  loading={publishSwarmMutation.isLoading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Publish
                </Button>
                <Button
                  disabled={!timestampToDownload?.length}
                  variant="secondary"
                  onClick={onDownloadSwarm}
                  loading={isDownloadLoading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant={'secondary'} 
                  onClick={onRunSwarm} 
                  loading={runSwarmMutation.isLoading} 
                  loadingText=" Deploying"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Test
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area - reduced padding */}
      <div className="flex-1 flex flex-col px-8">
        {/* Instructions and tags in one line */}
        <div className="mb-4 flex justify-between items-center">
          {/* Instructions text */}
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Design your swarm by dragging components onto the canvas. Connect them together to create your workflow.
            </span>
          </div>

          {/* Tags section */}
          <div className="flex flex-wrap gap-2 justify-end">
            {swarmTags?.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-[#002856]/5 text-[#002856] rounded-md text-sm"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => setSwarmTags(tags => tags.filter((_, i) => i !== index))}
                  className="hover:text-[#002856]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <input
              type="text"
              className="text-sm px-2 py-1 border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 w-32"
              placeholder="Add tag"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  e.preventDefault();
                  const newTag = e.currentTarget.value.trim();
                  if (!swarmTags.includes(newTag)) {
                    setSwarmTags(prev => [...prev, newTag]);
                  }
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </div>
        
        {/* Content container */}
        <div className="flex gap-8">
          {/* Sidebar - Components */}
          <aside className="w-64 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider">Components</h3>
            </div>
            <nav className="divide-y divide-gray-100">
              {/* Standard Nodes section */}
              <div className="px-3 py-2">
                <button
                  onClick={() => toggleSection("standardNodes")}
                  className="flex items-center justify-between w-full text-left p-2 rounded-md 
                    hover:bg-gray-50 transition-colors group"
                >
                  <span className="font-medium text-gray-700 group-hover:text-gray-900">Standard Nodes</span>
                  {expandedSections.standardNodes ? (
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>
                {expandedSections.standardNodes && (
                  <div className="space-y-1.5 mt-1 pl-1">
                    {standardNodes?.map(nodeItem => (
                      <div
                        key={nodeItem.id}
                        className="group flex items-center gap-3 p-2 rounded-md border border-gray-100
                          bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-100
                          active:bg-blue-100 cursor-move transition-all duration-200
                          hover:shadow-sm"
                        draggable
                        onDragStart={(event) => onDragStart(event, "start", nodeItem)}
                      >
                        <div className="p-1.5 rounded-md bg-[#002856]/5 text-[#002856] group-hover:bg-[#002856]/10">
                          <Play className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 flex-1">
                          {nodeItem.label}
                        </span>
                        <GripVertical className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Agents section */}
              <div className="px-3 py-2">
                <button
                  onClick={() => toggleSection("agents")}
                  className="flex items-center justify-between w-full text-left p-2 rounded-md 
                    hover:bg-gray-50 transition-colors group"
                >
                  <span className="font-medium text-gray-700 group-hover:text-gray-900">Agents</span>
                  {expandedSections.agents ? (
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>
                {expandedSections.agents && (
                  <>
                    {isAgentListLoading && (
                      <div className="space-y-1.5 mt-1 pl-1">
                        {[...Array(5).keys()]?.map((agentLoadingItem) => (
                          <div className="flex items-center space-x-2 p-2" key={agentLoadingItem} >
                            <Skeleton className="w-6 h-[20px]" />
                            <Skeleton className="w-1/2 h-[20px]" />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="space-y-1.5 mt-1 pl-1">
                      {!isAgentListLoading && agentData?.map((agentItem: any) => (
                        <div
                          key={agentItem.agentid}
                          draggable
                          onDragStart={(event) => onDragStart(event, "agent", {
                            label: agentItem?.name,
                            id: agentItem?.agentid,
                            ...agentItem,
                          })}
                          className="group flex items-center gap-3 p-2 rounded-md border border-gray-100
                            bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-100
                            active:bg-blue-100 cursor-move transition-all duration-200
                            hover:shadow-sm"
                        >
                          <div className="p-1.5 rounded-md bg-[#002856]/5 text-[#002856] group-hover:bg-[#002856]/10">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 flex-1">
                            {agentItem?.name}
                          </span>
                          <GripVertical className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </nav>
          </aside>

          {/* Main Content - Canvas */}
          <main className="flex-1">
            <Card>
              <CardContent className="h-[80vh] pt-6 bg-transparent rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <FlowchartComponent 
                  nodes={existingNodes} 
                  edges={existingEdges} 
                  onNodesDelete={onNodesDelete}
                />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {showChatBubble && (
        <ResizableDrawer
          port={portToRun}
          onClose={onChatClose}
          instanceId={timestampToDownload}
          />
        )}

      {/* Save Dialog */}
      <Dialog 
        open={isSaveDialogOpen} 
        onOpenChange={setIsSaveDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Save Swarm</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Name field */}
            <div className="space-y-2">
              <label
                htmlFor="swarm-name"
                className="block text-sm font-medium text-gray-700"
              >
                Name*
              </label>
              <Input
                id="swarm-name"
                value={swarmName}
                onChange={(e) => setSwarmName(e.target.value)}
                placeholder="Enter swarm name"
              />
              <Label htmlFor="name" className="text-right font-normal text-xs">
                {(isSwarmExistsLoading && !(formError?.length > 0)) ? "Checking" : ""}
                {((swarmExists !== undefined && !(formError?.length > 0)) ? (
                  (swarmExists && !isSwarmExistsLoading) ?
                    <span className="text-red-700">Swarm name already taken</span> :
                    <span className="text-green-800">Swarm name is available</span>
                ) : null)}
                {formError?.length > 0 && (
                  <span className="text-red-700">{formError}</span>
                )}
              </Label>
            </div>

            {/* Description field */}
            <div className="space-y-2">
              <label
                htmlFor="swarm-description"
                className="block text-sm font-medium text-gray-700"
              >
                Description*
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
              disabled={
                swarmExists ||
                isSwarmExistsLoading ||
                !swarmName?.length ||
                !swarmDescription?.length ||
                formError.length > 0
              }
              variant="primary"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
