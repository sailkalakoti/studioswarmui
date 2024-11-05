"use client";

import React, { useState } from "react";
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
import Header from "./header";

// Mock data for routines
const routines = [
  { id: 1, name: "Data Processing Workflow" },
  { id: 2, name: "Customer Support Bot" },
  { id: 3, name: "Content Generation" },
  { id: 4, name: "Market Analysis" },
];

export function CreateAgentComponent() {
  const [name, setName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedRoutines, setSelectedRoutines] = useState([]);

  const handleCreateAgent = () => {
    console.log("Creating agent:", { name, systemPrompt, selectedRoutines });
    // Here you would typically send this data to your backend
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black w-full">
      {/* <Header /> */}

      <main className="flex-grow p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Create New Agent</h2>

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
                      {routines.map((routine) => (
                        <SelectItem
                          key={routine.id}
                          value={routine.id.toString()}
                        >
                          {routine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedRoutines.map((routineId) => {
                      const routine = routines.find(
                        (r) => r.id.toString() === routineId,
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
                  Create Agent
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
