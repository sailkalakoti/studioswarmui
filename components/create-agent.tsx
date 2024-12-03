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
import { Plus, Sparkles } from "lucide-react";

import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "@/lib/apiService";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import useDebounce, { useApiMutation, useFetchData } from "@/lib/utils";

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
    onSuccess(data: any) {
      setSystemPrompt(data?.magic_prompt);
    },
  })


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

  return (
    <div className="flex flex-col min-h-screen bg-white text-black w-full">
      <Toaster toastOptions={{ position: "bottom-right" }} />
      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto mx-auto">
          <div className="mb-4">
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
          </div>
          <h2 className="text-3xl font-bold">{isCreate ? "Create New Agent" : nameForTitle}</h2>
          <p className="text-sm font-regular mb-6">
            {isCreate ? PAGE_SUBTITLES['agents'] : descriptionForTitle}
          </p>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Form submited");
                handleCreateAgent();
              }}
            >
              <div className="space-y-6">
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
                    className="text-sm font-bold text-gray-700"
                  >
                    Description*
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1"
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="system-prompt"
                    className="text-sm font-bold text-gray-700"
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
                    <Button
                      size="icon"
                      className="absolute right-1 bottom-1 rounded-full"
                      onClick={generateMagicPrompt}
                      disabled={generateMagicPromptMutation.isLoading}
                      aria-label="Generate magic prompt"
                      title="Enhance prompt"
                    >
                      {generateMagicPromptMutation.isLoading ? <AnimatedSparkles className="h-4 w-4" />: <Sparkles className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="routines"
                    className="text-sm font-bold text-gray-700"
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedRoutines?.map((routineId) => {
                      const routine: any = routineList?.find(
                        (r: any) => r.routineid.toString() === routineId.toString(),
                      ) || { name: "" };
                      return (
                        <div
                          key={routineId}
                          className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm flex items-center"
                        >
                          {routine.name}
                          <button
                            onClick={() =>
                              setSelectedRoutines((prev) =>
                                prev.filter((id) => id !== routineId),
                              )
                            }
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
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
                    <Plus className="w-4 h-4 mr-2" />
                    {isCreate ? "Create Agent" : "Update Agent"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
