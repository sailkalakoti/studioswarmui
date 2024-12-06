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

// Update the nodeStyles object
const nodeStyles = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '2px',
  boxShadow: '0 8px 32px rgba(0, 40, 86, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative' as const,
  width: '300px',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-2px',
    borderRadius: '18px',
    padding: '2px',
    background: 'linear-gradient(135deg, #002856, #1a4c8b, #0071B2)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude'
  }
};

export const CustomNode = ({ data }: { data: { label: string; description?: string } }) => {
  const isStartNode = data.label === "Start";
  
  return (
    <>
      <Handle type="target" position={Position.Left} id='custom-target-top' />
      <Handle type="source" position={Position.Left} id='custom-source-top' />
      <div className={`relative group ${isStartNode ? 'w-[150px]' : 'w-[300px]'} transition-transform duration-200 hover:-translate-y-0.5`}>
        <div className="p-4 bg-white rounded-[14px] border border-gray-100 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#002856] to-[#1a4c8b] shadow-lg flex-shrink-0">
              <Play className="h-5 w-5 text-white" />
            </div>
            
            <div className="min-w-0 flex-1">
              <label className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#002856] to-[#1a4c8b] block truncate">
                {data.label}
              </label>
              {data.description && (
                <p className="text-sm text-gray-500 mt-1 break-words">
                  {data.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Right} id="custom-target-bottom" />
      <Handle type="source" position={Position.Right} id="custom-source-bottom" />
    </>
  );
}

export const AgentNode = ({ data }: { data: { label: string; description?: string } }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} id='custom-target-top' />
      <Handle type="source" position={Position.Left} id='custom-source-top' />
      <div className="relative group w-[300px]">
        <div className="p-4 bg-white rounded-[14px] border border-gray-100 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#002856] to-[#1a4c8b] shadow-lg flex-shrink-0">
              <User className="h-5 w-5 text-white" />
            </div>
            
            <div className="min-w-0 flex-1">
              <label className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#002856] to-[#1a4c8b] block truncate">
                {data.label}
              </label>
              {data.description && (
                <p className="text-sm text-gray-500 mt-1 break-words">
                  {data.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Right} id="custom-target-bottom" />
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
        <div className="relative group cursor-pointer">
          {/* Animated gradient border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#002856] via-[#1a4c8b] to-[#0071B2] rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
          
          <div className="relative px-6 py-4 bg-white rounded-lg leading-none flex items-center">
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
