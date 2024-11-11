"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "react-query";
import axiosInstance from "@/lib/apiService";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const createAgent = async (payload) => {
  if (payload.id !== 'create') {
    const { data } = await axiosInstance.put('/agents/' + payload.id, payload.data);
  return data;
  }
  const { data } = await axiosInstance.post('/agents/', payload.data);
  return data;
}

const getRoutines = async ({ queryKey }) => {
  const { data } = await axiosInstance.get(queryKey[0]);
  return data;
}

const getAgent = async ({ queryKey }) => {
  const { data } = await axiosInstance.get(queryKey[0]);
  return data;
}

export function CreateAgentComponent({ id }) {
  const [name, setName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedRoutines, setSelectedRoutines] = useState([]);

  const queryClient = useQueryClient();
  const router = useRouter();
  const isCreate = id === 'create';

  const { data: routineList, error } = useQuery('/routines/', getRoutines);
  const { data: agentData } = useQuery(!isCreate ? '/agents/'+id : null, getAgent);

  useEffect(() => {
    if (error) {
      toast.error('Error while fetching routines');
    }
  }, [error]);

  useEffect(() => {
    if (Object?.keys(agentData || {})?.length > 0) {
      setName(agentData?.name);
      setSystemPrompt(agentData?.prompt);
      setSelectedRoutines(agentData?.routines);
    }
  }, [agentData]);

  const mutation = useMutation(createAgent, {
    onSuccess: () => {
      queryClient.invalidateQueries([]);
      toast.success("Created new Agent");
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
        description: systemPrompt,
        routines: selectedRoutines.map(item => Number(item)),
        metadata: {},
        metadata_info: {},
      }
    })
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black w-full">
      {/* <Header /> */}
      <Toaster toastOptions={{ position: "bottom-right" }} />
      <main className="flex-grow p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">{isCreate ? "Create New Agent" : "Update Agent"}</h2>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateAgent();
              }}
            >
              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="agent-name"
                    className="text-sm font-bold text-gray-700"
                  >
                    Agent Name
                  </Label>
                  <Input
                    id="agent-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                    placeholder="Enter agent name"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="system-prompt"
                    className="text-sm font-bold text-gray-700"
                  >
                    System Prompt
                  </Label>
                  <Textarea
                    id="system-prompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="mt-1"
                    placeholder="Enter system prompt"
                    rows={4}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="routines"
                    className="text-sm font-bold text-gray-700"
                  >
                    Routines
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setSelectedRoutines((prev) => [...prev, value])
                    }
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select routines" />
                    </SelectTrigger>
                    <SelectContent>
                      {routineList?.map((routine) => (
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
                    {selectedRoutines.map((routineId) => {
                      const routine = routineList.find(
                        (r) => r.routineid.toString() === routineId.toString(),
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

                <Button
                  type="submit"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isCreate ? "Create Agent" : "Update Agent"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* <footer className="bg-gray-100 border-t border-gray-200 p-4 text-center text-sm text-gray-600">
        <p>© 2024 StudioSwarm. All rights reserved.</p>
        <div className="mt-2">
          <a href="#" className="hover:text-black">
            Terms of Service
          </a>
          <span className="mx-2">|</span>
          <a href="#" className="hover:text-black">
            Privacy Policy
          </a>
          <span className="mx-2">|</span>
          <a href="#" className="hover:text-black">
            Contact Us
          </a>
        </div>
      </footer> */}
    </div>
  );
}
