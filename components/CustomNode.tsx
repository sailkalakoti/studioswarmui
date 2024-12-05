"use client";
import { Handle, Position } from "@xyflow/react";
import { ComputerIcon, EditIcon, MessageSquareQuote, Play, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

export const CustomNode = ({ data }: { data: { label: string } }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} id='custom-target-top' />
      <Handle type="source" position={Position.Left} id='custom-source-top' />
      <div className="rounded-md p-0.5 bg-gradient-to-tr from-indigo-600 via-pink-600 to-purple-600">
        <div className="h-full w-full p-3 rounded-md bg-white flex items-center gap-2">
          <Play className="h-4 w-4 text-[#002856]" />
          <label htmlFor="text">{data.label}</label>
        </div>
      </div>
      <Handle type="target" position={Position.Right} id="custom-target-bottom" />
      <Handle
        type="source"
        position={Position.Right}
        id="custom-source-bottom"
      />
    </>
  );
}

export const AgentNode = ({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} id='custom-target-top' />
      <Handle type="source" position={Position.Left} id='custom-source-top' />
      <div className="rounded-md p-0.5 bg-gradient-to-tr from-indigo-600 via-pink-600 to-purple-600">
        <div className="rounded-md bg-white p-3">
          <div className="h-full w-full bg-white flex items-center gap-2">
            <User className="h-4 w-4 text-[#002856]" />
            <label htmlFor="text">{data.label}</label>
          </div>
          <div className="pt-2 h-full w-full bg-white max-w-[300px] min-w-[300px]">
            <div className="text-sm">{data.description}</div>
          </div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Right}
        id="custom-target-bottom"
      />
      <Handle type="source" position={Position.Right} id="custom-source-bottom" />
    </>
  );
}

// Custom Node Components
export const ChatInputNode = ({ data }: { data: { description: string } }) => (
  <DialogComp>
    <div className="flex h-full absolute flex-col left-0 top-0 justify-evenly">
      <div className="relative">
        <Handle
          type="target"
          id="ci-left-target"
          className="!left-[-3px] !w-2 !h-2 !top-0 !bg-gray-400 !transform-none"
          position={Position.Left}
        />
        <Handle
          type="source"
          id="ci-left"
          className="!top-0 !left-[-3px] !w-2 !h-2 !bg-gray-400 !transform-none"
          position={Position.Left}
        />
      </div>
    </div>
    <div className="flex items-center mb-2">
      <MessageSquareQuote className="w-5 h-5 mr-2" />
      <div className="font-semibold text-gray-700">Chat Input</div>
    </div>
    <div className="text-sm text-gray-500">{data.description}</div>
    <div className="flex h-full absolute flex-col right-0 top-0 justify-evenly">
      <div className="relative">
        <Handle
          type="target"
          id="ci-right-target"
          className="!left-[-5px] !top-0 !w-2 !h-2 !bg-gray-400 !transform-none"
          position={Position.Right}
        />
        <Handle
          type="source"
          id="ci-right"
          className="!left-[-5px] !top-0 !w-2 !h-2 !bg-gray-400 !transform-none"
          position={Position.Right}
        />
      </div>
    </div>
  </DialogComp>
);

export const PromptNode = ({ data }: { data: { description: string } }) => (
  <DialogComp>
    <div className="flex h-full absolute flex-col left-0 top-0 justify-evenly">
      <div className="relative">
        <Handle
          type="target"
          id="pn-left-target"
          className="!top-0 !left-[-3px] !w-2 !h-2 !bg-gray-400 !transform-none"
          position={Position.Left}
        />
        <Handle
          type="source"
          id="pn-left"
          className="!left-[-3px] !w-2 !h-2 !top-0 !bg-gray-400 !transform-none"
          position={Position.Left}
        />
      </div>
    </div>
    <div className="flex items-center mb-2">
      <EditIcon className="w-5 h-5 mr-2" />
      <div className="font-semibold text-gray-700">Prompt</div>
    </div>
    <div className="text-sm text-gray-500">{data.description}</div>
    <div className="flex h-full absolute flex-col right-0 top-0 justify-evenly">
      <div className="relative">
        <Handle
          type="target"
          id="pn-right-target"
          className="!left-[-5px] !top-0 !w-2 !h-2 !bg-gray-400 !transform-none"
          position={Position.Right}
        />
        <Handle
          type="source"
          id="pn-right"
          className="!left-[-5px] !top-0 !w-2 !h-2 !bg-gray-400 !transform-none"
          position={Position.Right}
        />
      </div>
    </div>
  </DialogComp>
);

export const OpenAINode = ({
  data,
}: {
  data: {
    description: string;
    modelName: string;
    apiKey: string;
    temperature: string;
  };
}) => (
  <DialogComp>
    <div className="flex h-full absolute flex-col left-0 top-0 justify-evenly">
      <div className="relative">
        <Handle
          type="target"
          id="oi-left-target"
          className="!top-0 !left-[-3px] !w-2 !h-2 !bg-gray-400 !transform-none"
          position={Position.Left}
        />
        <Handle
          type="source"
          id="oi-left"
          className="!left-[-3px] !w-2 !h-2 !top-0 !bg-gray-400 !transform-none"
          position={Position.Left}
        />
      </div>
    </div>
    <div className="flex items-center mb-2">
      <ComputerIcon className="w-5 h-5 mr-2" />
      <div className="font-semibold text-gray-700">OpenAI</div>
    </div>
    <div className="text-sm text-gray-500">{data.description}</div>
    <div className="mt-2">
      <div className="text-xs text-gray-400">Model Name</div>
      <div className="text-sm">{data.modelName}</div>
    </div>
    <div className="mt-1">
      <div className="text-xs text-gray-400">OpenAI API Key</div>
      <div className="text-sm">{data.apiKey}</div>
    </div>
    <div className="mt-1">
      <div className="text-xs text-gray-400">Temperature</div>
      <div className="text-sm">{data.temperature}</div>
    </div>
    <div className="flex h-full absolute flex-col right-0 top-0 justify-evenly">
      <div className="relative">
        <Handle
          type="target"
          id="oi-right-target"
          className="!left-[-5px] !top-0 !w-2 !h-2 !bg-gray-400 !transform-none"
          position={Position.Right}
        />
        <Handle
          type="source"
          id="oi-right"
          className="!left-[-5px] !top-0 !w-2 !h-2 !bg-gray-400 !transform-none"
          position={Position.Right}
        />
      </div>
    </div>
  </DialogComp>
);

export const ChatOutputNode = ({ data }: { data: { description: string } }) => (
  <DialogComp>
    <div className="flex h-full absolute flex-col left-0 top-0 justify-evenly">
      <div className="relative">
        <Handle
          type="target"
          id="co-left-target"
          className="!top-0 !left-[-3px] !w-2 !h-2 !bg-gray-400 !transform-none"
          position={Position.Left}
        />
        <Handle
          type="source"
          id="co-left"
          className="!left-[-3px] !w-2 !h-2 !top-0 !bg-gray-400 !transform-none"
          position={Position.Left}
        />
      </div>
    </div>
    <div className="flex items-center mb-2">
      <MessageSquareQuote className="w-5 h-5 mr-2" />
      <div className="font-semibold text-gray-700">Chat Output</div>
    </div>
    <div className="text-sm text-gray-500">{data.description}</div>
    <div className="flex h-full absolute flex-col right-0 top-0 justify-evenly">
      <div className="relative">
        <Handle
          type="target"
          id="co-right-target"
          className="!left-[-5px] !top-0 !w-2 !h-2 !bg-gray-400 !transform-none"
          position={Position.Right}
        />
        <Handle
          type="source"
          id="co-left"
          className="!left-[-5px] !top-0 !w-2 !h-2 !bg-gray-400 !transform-none"
          position={Position.Right}
        />
      </div>
    </div>
  </DialogComp>
);

const frameworks = [
  {
    value: "openai",
    label: "OpenAI",
  },
  {
    value: "proximity",
    label: "Proximity",
  },
  {
    value: "anthropic",
    label: "Anthropic",
  },
  {
    value: "gemini",
    label: "Gemini",
  },
  {
    value: "grok",
    label: "Grok",
  },
];

export function FrameworkSelection() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function DialogComp({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="rounded-md p-0.5 bg-gradient-to-tr from-[#002856] via-[#002856]/80 to-[#002856]/70">
          <div className="h-full w-full p-3 rounded-md bg-white">
            {children}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit details</DialogTitle>
          <DialogDescription>
            Make changes to prompt here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="framework" className="text-right">
              Frameworks
            </Label>
            <FrameworkSelection />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input id="description" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prompt" className="text-right">
              Prompt
            </Label>
            <Textarea id="prompt" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
