"use client";

import React, { useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import "prismjs/themes/prism.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Play, Clock, CheckCircle, WandSparkles, X, Hash, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import useDebounce, { useApiMutation, useFetchData } from "@/lib/utils";
import constants from "@/constants";
import BreadCrumbs from "./Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";

const highlightWithoutPython = (code: string) => {
  return code
    .split("\n")
    .map(
      (line) =>
        `<span class="token comment">${line.startsWith("#") ? line : ""}</span>` +
        `<span class="token keyword">${!line.startsWith("#") ? line : ""}</span>`,
    )
    .join("\n");
};

const codeGenerateURL = 'http://178.156.143.254:8001/studioswarm';

export function PythonEditorComponent({ id }) {
  const { FORM_VALIDATION_MESSAGES, PAGE_SUBTITLES } = constants;
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [prompt, setPrompt] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [requirements, setRequirements] = useState("");
  const [lastRun, setLastRun] = useState(new Date());
  const [successRate, setSuccessRate] = useState(null);
  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingCode, setStreamingCode] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamInterval, setStreamInterval] = useState<NodeJS.Timeout | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [relatedSwarms] = useState([]);

  const debouncedRoutineName = useDebounce(routineName, 300);
  const router = useRouter();
  const isCreate = id === 'create';

  const {
    data: routineExists,
    isLoading: isRoutineExistLoading
  } = useFetchData(isCreate && debouncedRoutineName?.length > 0 ? '/routines/exists?name=' + debouncedRoutineName : null);

  const { data: routineData }: { data: any } = useFetchData(!isCreate ? '/routines/' + id : null);

  useEffect(() => {
    if (Object?.keys(routineData || {})?.length > 0) {
      setCode(routineData.code);
      setRoutineName(routineData.name);
      setRoutineDescription(routineData.description);
      setRequirements(routineData?.requirements);
    }
  }, [routineData]);

  useEffect(() => {
    if (routineName.includes(" ")) {
      setFormError(FORM_VALIDATION_MESSAGES.SPACE_NOT_ALLOWED);
    } else {
      setFormError("");
    }
  }, [routineName, FORM_VALIDATION_MESSAGES.SPACE_NOT_ALLOWED]);

  const mutation = useApiMutation(isCreate ? '/routines/' : `/routines/${id}`, isCreate ? 'POST' : 'PUT', {
    onSuccess: () => {
      toast.success(isCreate ? "Created new routine" : "Updated routine");
      router.push('/routines');
      setIsSaveDialogOpen(false);
    }
  });

  const codeMutation = useApiMutation('/routines/code/execution/', 'POST', {
    onSuccess: (data: any) => {
      setOutput(data.output);
      setShowOutput(true);
      setLastRun(new Date());
      setSuccessRate(Math.floor(Math.random() * 11) + 90); // Random success rate between 90-100%
    },
    onError: () => {
      toast.error("Error while executing the code");
    }
  });

  const codeGenerateMutation = useApiMutation(codeGenerateURL + '/routines/code/generation/', 'POST', {
    onSuccess: (data: any, variables: any, context: unknown): void => {
      setIsGenerating(false);
      const finalCode = data?.code || "";
      setIsStreaming(true);
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex <= finalCode.length) {
          setStreamingCode(finalCode.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsStreaming(false);
          setCode(finalCode);
          setRequirements(data?.requirements?.join("\n") || "");
        }
      }, 10);

      setStreamInterval(interval);
    }
  });

  const codeValidationMutation = useApiMutation('/routines/code/generation/validate-syntax', 'POST', {
    onSuccess: (data: any) => {
      const { is_valid, error_message } = data || {};
      if (!is_valid) {
        setOutput(error_message);
        setShowOutput(true);
        return;
      } else {
        setOutput("");
        setShowOutput(false);
      }

      if (!isCreate) {
        saveCode();
      } else {
        setIsSaveDialogOpen(true);
      }
    }
  })

  const runCode = () => {
    codeMutation.mutate({
      code,
      dependencies: requirements?.split("\n")?.filter(item => !!item.length),
    })
  };

  const generateCode = () => {
    setIsGenerating(true);
    setStreamingCode(""); // Reset streaming code
    codeGenerateMutation.mutate({
      prompt: prompt,
    });
  };

  const saveCode = () => {
    mutation.mutate({
      name: routineName,
      description: routineDescription,
      code,
      requirements,
      metadata: {},
      metadata_info: {},
    })
  };

  const onSaveClick = () => {
    codeValidationMutation?.mutate({
      code,
    });
  }

  useEffect(() => {
    return () => {
      if (streamInterval) clearInterval(streamInterval);
    };
  }, [streamInterval]);

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <BreadCrumbs
              path={[
                {
                  label: "Dashboard",
                  href: "/dashboard",
                },
                {
                  label: "Routines",
                  href: "/routines",
                },
                {
                  label: isCreate ? "Create Routine" : routineName,
                }
              ]}
            />
          </div>
          <h2 className="text-3xl font-bold">{
            isCreate ? "Craft Your Own Routines" : routineName
          }</h2>
          <p className="text-sm font-regular mb-6">
            {isCreate ? PAGE_SUBTITLES['routines'] : routineDescription}
          </p>
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold mb-2">How can I assist with generating code for your routine?</h3>
                  <div className="flex space-x-4">
                    <Input
                      type="text"
                      placeholder="Enter your prompt here"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="flex-grow"
                    />
                    <Button
                      onClick={generateCode}
                      variant={"secondary"}
                      loading={codeGenerateMutation.isLoading}
                    >
                      <WandSparkles className="mr-2" />
                      Generate
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="code" className="p-4">
                  <TabsList className="mb-4">
                    <TabsTrigger value="code" className="text-sm font-medium">
                      Code
                    </TabsTrigger>
                    <TabsTrigger
                      value="requirements"
                      className="text-sm font-medium"
                    >
                      Requirements
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="code">
                    {isGenerating ? (
                      <div className="space-y-2 p-2 min-h-[400px]">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/5" />
                      </div>
                    ) : (
                      <Editor
                        value={isStreaming ? streamingCode : code}
                        onValueChange={(code) => !isStreaming && setCode(code)}
                        highlight={(code) => highlightWithoutPython(code)}
                        padding={10}
                        style={{
                          fontFamily: '"Fira code", "Fira Mono", monospace',
                          fontSize: 14,
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "0.375rem",
                          minHeight: "400px",
                        }}
                        textareaClassName="focus:outline-none"
                        readOnly={isStreaming} // Prevent editing while streaming
                      />
                    )}
                  </TabsContent>
                  <TabsContent value="requirements">
                    <Textarea
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="List your Python dependencies here"
                      className="min-h-[400px] resize-none border rounded-md p-2"
                    />
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end p-4 border-t border-gray-200">
                  <Button
                    onClick={runCode}
                    className="mr-2"
                    variant={"secondary"}
                    loading={codeMutation.isLoading}
                    disabled={!code?.length}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Run Code
                  </Button>
                  <Dialog
                    open={isSaveDialogOpen}
                    onOpenChange={setIsSaveDialogOpen}
                  >
                    <Button
                      variant={"primary"}
                      onClick={onSaveClick}
                      disabled={!code?.length}
                      loading={codeValidationMutation.isLoading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Save Routine</DialogTitle>
                        <DialogDescription>
                          Enter the name and description for your routine.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-8 py-4">
                        <div>
                          <Label htmlFor="name" className="text-right">
                            Name*
                          </Label>
                          <div className="col-span-3">
                            <Input
                              id="name"
                              value={routineName}
                              onChange={(e) => setRoutineName(e.target.value)}

                            />
                            <Label htmlFor="name" className="text-right font-normal absolute pt-1 text-xs">
                              {(isRoutineExistLoading && !(formError?.length > 0)) ? "Checking" : ""}
                              {((routineExists !== undefined && !(formError?.length > 0)) ? (
                                (routineExists && !isRoutineExistLoading) ?
                                  <span className="text-red-700">Routine name already taken</span> :
                                  <span className="text-green-800">Routine name is available</span>
                              ) : null)}
                              {formError?.length > 0 && (
                                <span className="text-red-700">{formError}</span>
                              )}
                            </Label>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description" className="text-right">
                            Description*
                          </Label>
                          <Textarea
                            id="description"
                            value={routineDescription}
                            onChange={(e) => setRoutineDescription(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={saveCode}
                          loading={mutation.isLoading}
                          variant="primary"
                          disabled={
                            Boolean(routineExists) ||
                            isRoutineExistLoading ||
                            !routineName?.length ||
                            !routineDescription?.length ||
                            formError.length > 0
                          }
                        >
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {showOutput && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Output</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Last run: {lastRun.toLocaleString()}
                    </div>
                  </div>
                  <pre className="p-4 overflow-auto max-h-64 bg-gray-50">
                    <code>{output}</code>
                  </pre>
                </div>
              )}
            </div>

            <div className="space-y-5 w-80">
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="space-y-3">
                  <div>
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      className="w-full bg-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Press enter to add a tag
                    </p>
                  </div>
                  
                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full 
                            bg-gray-50 text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="text-gray-500 hover:text-gray-700 ml-0.5"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 px-4">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 mb-3">
                        <Hash className="h-5 w-5 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        No Tags Added
                      </h3>
                      <p className="text-sm text-gray-500 max-w-[200px] mx-auto">
                        Add tags to help organize and find this routine easily
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-lg font-semibold mb-4">Connected Agents</h3>
                <div className="space-y-3">
                  {relatedSwarms.length > 0 ? (
                    relatedSwarms.map((swarm) => (
                      <div 
                        key={swarm.id}
                        className="p-3 rounded-lg border border-gray-100 hover:border-[#002856]/10 
                          hover:bg-gray-50 transition-all group cursor-pointer"
                      >
                        <div className="font-medium text-gray-900 mb-1 group-hover:text-[#002856]">
                          {swarm.name}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {swarm.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 px-4">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 mb-3">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        No Agents Connected
                      </h3>
                      <p className="text-sm text-gray-500 max-w-[200px] mx-auto">
                        This routine isn&apos;t part of any swarms yet. Add it to a swarm to see it here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
