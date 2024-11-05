"use client";

import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import "prismjs/themes/prism.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Play, Clock, CheckCircle } from "lucide-react";
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
import Link from "next/link";
import Header from "./header";

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

export function PythonEditorComponent() {
  const [code, setCode] = useState(
    '# Write your Python code here\nprint("Hello, World!")',
  );
  const [output, setOutput] = useState("");
  const [prompt, setPrompt] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [requirements, setRequirements] = useState(
    "# List your Python dependencies here\n# Example:\n# numpy==1.21.0\n# pandas==1.3.0",
  );
  const [lastRun, setLastRun] = useState(new Date());
  const [successRate, setSuccessRate] = useState(null);
  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const runCode = () => {
    setOutput(`Simulated output:\n${code}`);
    setShowOutput(true);
    setLastRun(new Date());
    // @ts-expect-error Random success rate between 90-100%
    setSuccessRate(Math.floor(Math.random() * 11) + 90); // Random success rate between 90-100%
  };

  const generateCode = () => {
    setCode(
      `# Generated code based on prompt: ${prompt}\n\nprint("This is a generated response.")`,
    );
  };

  const saveCode = () => {
    console.log("Routine Name:", routineName);
    console.log("Routine Description:", routineDescription);
    console.log("Code saved:", code);
    console.log("Requirements saved:", requirements);
    setIsSaveDialogOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black w-full">
      {/* <Header /> */}

      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold">Craft Your Own Routines</h2>
          <p className="text-sm font-regular mb-6">Create, run, and save your own routines with ease. Write or generate code, all in one place.</p>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Code Generation</h3>
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
                  // className="bg-red-500 hover:bg-red-600 text-white"
                  variant={"secondary"}
                >
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
                <Editor
                  value={code}
                  onValueChange={(code) => setCode(code)}
                  highlight={(code) => highlightWithoutPython(code)}
                  padding={10}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 14,
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.375rem",
                    minHeight: "300px",
                  }}
                  textareaClassName="focus:outline-none"
                />
              </TabsContent>
              <TabsContent value="requirements">
                <Textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="List your Python dependencies here"
                  className="min-h-[300px] resize-none border rounded-md p-2"
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end p-4 border-t border-gray-200">
              <Button
                onClick={runCode}
                className="mr-2"
                variant={"secondary"}
              >
                <Play className="h-4 w-4 mr-2" />
                Run Code
              </Button>
              <Dialog
                open={isSaveDialogOpen}
                onOpenChange={setIsSaveDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant={"primary"}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Save Routine</DialogTitle>
                    <DialogDescription>
                      Enter the name and description for your routine.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={routineName}
                        onChange={(e) => setRoutineName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
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
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Save Routine
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
                  <CheckCircle className="h-4 w-4 ml-4 mr-1" />
                  Success: {successRate}%
                </div>
              </div>
              <pre className="p-4 overflow-auto max-h-64 bg-gray-50">
                <code>{output}</code>
              </pre>
            </div>
          )}
        </div>
      </main>

      {/* <footer className="bg-gray-100 border-t border-gray-200 p-4 text-center text-sm text-gray-600">
        <p>© 2024 StudioSwarm. All rights reserved.</p>
        <div className="mt-2">
          <Link href="#" className="hover:text-black">
            Terms of Service
          </Link>
          <span className="mx-2">|</span>
          <Link href="#" className="hover:text-black">
            Privacy Policy
          </Link>
          <span className="mx-2">|</span>
          <Link href="#" className="hover:text-black">
            Contact Us
          </Link>
        </div>
      </footer> */}
    </div>
  );
}
