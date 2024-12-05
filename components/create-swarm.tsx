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
  User,
  Save,
  Play,
  Upload,
  Download,
  GripVertical,
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
    if (!isSaveDialogOpen) {
      setSwarmName('');
      setSwarmDescription('');
    }
  }, [isSaveDialogOpen]);

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
    if (!isCreate) {
      event?.stopPropagation();
      event?.preventDefault();
      handleSave();
      return;
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
      <div className="flex-1 flex">
        <aside className="w-64 bg-white shadow-md">
          <nav className="mt-8">
            <div className="px-4 mb-4">
              <button
                onClick={() => toggleSection("standardNodes")}
                className="flex items-center justify-between w-full text-left mb-3"
              >
                <span className="font-semibold text-gray-800">Standard Nodes</span>
                {expandedSections.standardNodes ? (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                )}
              </button>
              {expandedSections.standardNodes && (
                <div className="space-y-1.5">
                  {standardNodes?.map(nodeItem => (
                    <div
                      key={nodeItem.id}
                      className="group flex items-center gap-3 p-2.5 rounded-lg border border-transparent 
                        bg-white hover:border-blue-100 hover:bg-blue-50/50 
                        active:bg-blue-100 cursor-move transition-all duration-200
                        hover:shadow-sm"
                      draggable
                      onDragStart={(event) => onDragStart(event, "start", nodeItem)}
                    >
                      <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                        <Play className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1">
                        {nodeItem.label}
                      </span>
                      <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-4 mb-4">
              <button
                onClick={() => toggleSection("agents")}
                className="flex items-center justify-between w-full text-left mb-3"
              >
                <span className="font-semibold text-gray-800">Agents</span>
                {expandedSections.agents ? (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                )}
              </button>
              {isAgentListLoading && (
                <div className="pt-2 space-y-2">
                  {[...Array(5).keys()]?.map((agentLoadingItem) => (
                    <div className="flex items-center space-x-2 p-2" key={agentLoadingItem} >
                      <Skeleton className="w-6 h-[24px]" />
                      <Skeleton className="w-1/2 h-[24px]" />
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-1.5">
                {!isAgentListLoading && agentData?.map((agentItem: any) => (
                  <div
                    key={agentItem.agentid}
                    draggable
                    onDragStart={(event) => onDragStart(event, "agent", {
                      label: agentItem?.name,
                      id: agentItem?.agentid,
                      ...agentItem,
                    })}
                    className="group flex items-center gap-3 p-2.5 rounded-lg border border-transparent 
                      bg-white hover:border-blue-100 hover:bg-blue-50/50 
                      active:bg-blue-100 cursor-move transition-all duration-200
                      hover:shadow-sm"
                  >
                    <div className="p-1.5 rounded-md bg-[#002856]/5 text-[#002856] group-hover:bg-[#002856]/10">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1">
                      {agentItem?.name}
                    </span>
                    <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
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
          <div className="flex justify-between items-center mb-8">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">{isCreate ? "Swarm" : swarmName}</h1>
              <p className="text-sm font-regular">
              {isCreate ? PAGE_SUBTITLES['swarms'] : swarmDescription}
              </p>
            </div>

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
              <Button variant={'secondary'} onClick={onRunSwarm} loading={runSwarmMutation.isLoading} loadingText=" Deploying">
                <Play className="h-4 w-4 mr-2" />
                Test
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <Card className="mb-8">
            <CardContent className="h-[80vh] pt-6 bg-transparent rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <FlowchartComponent nodes={existingNodes} edges={existingEdges} />
            </CardContent>
          </Card>
          {showChatBubble && (
            <ResizableDrawer
              port={portToRun}
              onClose={onChatClose}
              instanceId={timestampToDownload}
              />
            )}

          {/* Save Dialog */}
          <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Swarm</DialogTitle>
              </DialogHeader>
              <div className="space-y-8">
                <div>
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
                  <Label htmlFor="name" className="text-right font-normal absolute pt-1 text-xs">
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
                <div>
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
        </main>
      </div>
    </div>
  );
}
