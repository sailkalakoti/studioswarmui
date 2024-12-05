"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Sparkles, Cog, X, Save, Zap, Hash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "@/lib/apiService";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import useDebounce, { useApiMutation, useFetchData } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";

const colors = ['#FF008C', '#D309E1', '#9C1AFF', '#7700FF', '#4400FF']

function AnimatedLetter({ letter, index }: { letter: string; index: number }) {
  if (letter === ' ') {
    return <span className="inline-block w-[0.3em]">&nbsp;</span>
  }

  return (
    <motion.span
      initial={{ opacity: 0.3 }}
      animate={{
        opacity: [0.3, 1, 0.3],
        color: colors[index % colors.length],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay: index * 0.1,
      }}
      className="inline-block text-sm"
    >
      {letter}
    </motion.span>
  )
}

function AnimateText({ str }) {
  return (
    (
      <motion.div 
        className="whitespace-pre-wrap break-words bg-clip-text text-transparent"
        style={{
          backgroundImage: "linear-gradient(90deg, #FF008C, #D309E1, #9C1AFF, #7700FF, #4400FF)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        aria-label={`Animating text: ${str}`}
      >
        {str}
      </motion.div>
    )
  )
  return (
    <>
      {Array.from(str).map((letter: string, i) => (
        <AnimatedLetter key={i} letter={letter} index={i} />
      ))}
    </>
  )

}

import constants from "@/constants";
import clsx from "clsx";
import { ShimmerText } from "./ShimmerText";
import { AnimatedSparkles } from "./AnimatedSparkles";

const createAgent = async (payload) => {
  if (payload.id !== 'create') {
    const { data } = await axiosInstance.put('/agents/' + payload.id, payload.data);
    return data;
  }
  const { data } = await axiosInstance.post('/agents/', payload.data);
  return data;
}

export function CreateAgentComponent({ id }) {
  const { FORM_VALIDATION_MESSAGES, PAGE_SUBTITLES } = constants;
  const [name, setName] = useState("");
  const [nameForTitle, setNameForTitle] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionForTitle, setDescriptionForTitle] = useState("");
  const [selectedRoutines, setSelectedRoutines] = useState([]);
  const [formError, setFormError] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [relatedSwarms] = useState([]);

  const queryClient = useQueryClient();
  const router = useRouter();
  const isCreate = id === 'create';
  const { data, error }: { data: [], error: {} } = useFetchData('/routines/?limit=100');
  const { data: agentData }: { data: any } = useFetchData(!isCreate ? '/agents/' + id : null);

  const { data: routineList }: any = data || {};

  const debouncedAgentName = useDebounce(name, 300);

  const {
    data: agentExist,
    isLoading: isAgentExistLoading
  } = useFetchData(isCreate && debouncedAgentName?.length > 0 ? '/agents/exists?name=' + debouncedAgentName : null);

  const generateMagicPromptMutation = useApiMutation('/routines/code/generation/magic-prompt', 'POST', {
    onSuccess: (data: any, variables: any, context: unknown) => {
      setSystemPrompt(data?.magic_prompt);
      return Promise.resolve();
    },
  });


  useEffect(() => {
    if (error) {
      toast.error('Error while fetching routines');
    }
  }, [error]);

  useEffect(() => {
    if (name.includes(" ")) {
      setFormError(FORM_VALIDATION_MESSAGES.SPACE_NOT_ALLOWED)
    } else {
      setFormError("");
    }
  }, [name]);

  useEffect(() => {
    if (Object?.keys(agentData || {})?.length > 0) {
      setName(agentData?.name);
      setSystemPrompt(agentData?.prompt);
      setSelectedRoutines(agentData?.routines);
      setDescription(agentData?.description);

      setNameForTitle(agentData?.name);
      setDescriptionForTitle(agentData?.description)
    }
  }, [agentData]);

  const mutation = useMutation(createAgent, {
    onSuccess: () => {
      queryClient.invalidateQueries([]);
      toast.success(isCreate ? "Created new Agent" : "Updated agent");
      router.push('/agents');
    }
  });

  const handleCreateAgent = () => {
    console.log("Creating agent:", { name, systemPrompt, selectedRoutines });
    // Here you would typically send this data to your backend
    mutation.mutate({
      id,
      data: {
        userid: "abcd",
        orgid: 0,
        suborgid: 0,
        name: name,
        prompt: systemPrompt,
        description: description,
        routines: selectedRoutines.map(item => Number(item)),
        metadata: {},
        metadata_info: {},
      }
    })
  };

  const generateMagicPrompt = (event) => {
    event?.stopPropagation();
    // event?.stopImmediatePropagation();
    event?.preventDefault();
    generateMagicPromptMutation.mutate({
      'task_or_prompt': systemPrompt,
    })
  }

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
          <div className="mb-8">
            <Breadcrumbs
              path={[
                {
                  label: "Dashboard",
                  href: "/dashboard",
                },
                {
                  label: "Agents",
                  href: "/agents",
                },
                {
                  label: isCreate ? "Create Agent" : nameForTitle,
                }
              ]}
            />
            <h2 className="text-2xl font-bold mt-4">{isCreate ? "Create New Agent" : nameForTitle}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {isCreate ? PAGE_SUBTITLES['agents'] : descriptionForTitle}
            </p>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm">
                <form onSubmit={handleCreateAgent} className="p-6 space-y-5">
                  <div className="space-y-5">
                    <div>
                      <Label
                        htmlFor="agent-name"
                        className="text-sm font-bold text-gray-700"
                      >
                        Name*
                      </Label>
                      <Input
                        id="agent-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1"
                        placeholder="Enter agent name"
                      />
                      <Label htmlFor="name" className="text-right font-normal absolute pt-1 text-xs">
                        {(isAgentExistLoading && !(formError?.length > 0)) ? "Checking" : ""}
                        {((agentExist !== undefined && !(formError?.length > 0)) ? (
                          (agentExist && !isAgentExistLoading) ?
                            <span className="text-red-700">Agent name already taken</span> :
                            <span className="text-green-800">Agent name is available</span>
                        ) : null)}
                        {formError?.length > 0 && (
                          <span className="text-red-700">{formError}</span>
                        )}
                      </Label>
                    </div>
                    <div>
                      <Label
                        htmlFor="description"
                        className="text-sm font-bold text-gray-700 block mb-2"
                      >
                        Description*
                      </Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="system-prompt"
                        className="text-sm font-bold text-gray-700 block mb-2"
                      >
                        System Prompt*
                      </Label>
                      
                      <div className="relative">
                        <Textarea
                          id="system-prompt"
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          className={clsx("mt-1", {
                            'text-white': generateMagicPromptMutation.isLoading,
                          })}
                          placeholder="Enter system prompt"
                          rows={8}
                        />
                        {generateMagicPromptMutation.isLoading && (
                          <ShimmerText text={systemPrompt}  className="absolute top-[8px] left-[12px] text-sm overflow-hidden h-[90%]"/>
                        )}
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                className={clsx(
                                  "absolute right-1 bottom-1 rounded-full",
                                  generateMagicPromptMutation.isLoading 
                                    ? "bg-gradient-to-r from-[#002856] to-[#1a4c8b] text-white" 
                                    : "bg-gradient-to-r from-[#002856] to-[#1a4c8b] text-white hover:from-[#002856]/90 hover:to-[#1a4c8b]/90"
                                )}
                                onClick={generateMagicPrompt}
                                disabled={generateMagicPromptMutation.isLoading}
                                aria-label="Improve my Prompt"
                              >
                                {generateMagicPromptMutation.isLoading ? (
                                  <AnimatedSparkles className="h-4 w-4 text-white" />
                                ) : (
                                  <Sparkles className="h-4 w-4 text-white" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent 
                              className="bg-white px-3 py-1.5 text-sm font-medium text-gray-900 shadow-lg border border-gray-200 rounded-lg"
                              sideOffset={4}
                            >
                              Improve my Prompt
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="routines"
                        className="text-sm font-bold text-gray-700 block mb-2"
                      >
                        Add Routines
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setSelectedRoutines((prev) => {
                            const numericValue = Number(value);
                            if (!prev?.includes(numericValue)) {
                              return [...prev, numericValue];
                            }
                            return prev
                          })
                        }
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select routines" />
                        </SelectTrigger>
                        <SelectContent>
                          {routineList?.map((routine: any) => (
                            <SelectItem
                              key={routine.routineid}
                              value={routine.routineid.toString()}
                            >
                              {routine.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="mt-2 flex flex-wrap gap-3">
                        {selectedRoutines?.map((routineId) => {
                          const routine: any = routineList?.find(
                            (r: any) => r.routineid.toString() === routineId.toString(),
                          ) || { name: "" };
                          return (
                            <div
                              key={routineId}
                              className="group relative flex flex-col items-center w-[120px] p-4 bg-white rounded-xl border border-[#0000a9]/10 shadow-sm hover:shadow-md hover:border-[#0000a9]/20 transition-all"
                            >
                              <div className="flex items-center justify-center w-10 h-10 bg-[#0000a9]/5 rounded-lg mb-2">
                                <Cog className="h-5 w-5 text-[#0000a9]" />
                              </div>
                              <span className="text-sm font-medium text-gray-700 text-center line-clamp-2">
                                {routine.name}
                              </span>
                              <button
                                onClick={() =>
                                  setSelectedRoutines((prev) =>
                                    prev.filter((id) => id !== routineId),
                                  )
                                }
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-[#0000a9]/5 rounded-full transition-all"
                              >
                                <X className="h-3.5 w-3.5 text-[#0000a9]/60 hover:text-[#0000a9]" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={
                        Boolean(agentExist) ||
                        name?.length === 0 ||
                        isAgentExistLoading ||
                        !systemPrompt?.length ||
                        !description?.length ||
                        formError.length > 0
                      }
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </form>
              </div>
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
                        Add tags to help organize and find this agent easily
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-lg font-semibold mb-4">Connected Swarms</h3>
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
                        <Zap className="h-5 w-5 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        No Swarms Yet
                      </h3>
                      <p className="text-sm text-gray-500 max-w-[200px] mx-auto">
                        This agent isn't part of any swarms yet. Add it to a swarm to see it here.
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
